import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import DataTable from "@/components/DataTable";
import type { Group, Member } from "@/types/prismaTypes";
import { motion } from "framer-motion";

const AddMembers: NextPage = () => {
  const [id, setId] = useState<string>("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});
  // console.log("Checked", checkboxStates);

  const router = useRouter();
  const groupId = router.query.groupId as string | undefined;

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId as string);
    }
  }, [groupId]);

  const { status, data, error } = trpc.groups.getById.useQuery(id);
  const group = data as Group | undefined;

  const allMembers = trpc.members.getAll.useQuery().data as
    | Member[]
    | undefined;
  // console.log("All Members", allMembers);

  const addMembers = trpc.groups.addMember.useMutation();
  const { error: errorAddMembers } = addMembers;

  const handleOnChange = useCallback((memberId: string) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [memberId]: !prevState[memberId],
    }));
  }, []);

  const addSelectedMembers = async () => {
    const selectedMembers = Object.entries(checkboxStates)
      .filter(([_, isChecked]) => isChecked)
      .map(([memberId, _]) =>
        allMembers
          ?.filter(
            (member) =>
              !group?.members?.some(
                (groupMember) => groupMember.member?.id === member.id
              )
          )
          ?.find((member) => member.id === memberId)
      );
    // console.log("Selected Members", selectedMembers);

    await addMembers.mutateAsync({
      groupId: groupId as string,
      membersToAdd: selectedMembers.map((item) => item?.id) as string[],
    });
    router.push(`/groups/${groupId}/group-members`);
  };

  return (
    <div className="p-4">
      <motion.h1
        className="p-2 text-xl"
        initial={{ translateX: 1500 }}
        animate={{ translateX: 0 }}
        transition={{ duration: 0.8 }}
      >
        Add Members to {group?.name}
      </motion.h1>
      <motion.div
        className="flex items-center justify-between"
        initial={{ translateY: -500 }}
        animate={{ translateY: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="py-4">
          <Button size="lg" onClick={() => router.back()}>
            Go back
          </Button>
        </div>

        <div className="py-4">
          <Button
            size="lg"
            color="success"
            disabled={
              Object.entries(checkboxStates)
                .filter(([_, isChecked]) => isChecked)
                .map(([memberId, _]) =>
                  allMembers
                    ?.filter(
                      (member) =>
                        !group?.members?.some(
                          (groupMember) => groupMember.member?.id === member.id
                        )
                    )
                    ?.find((member) => member.id === memberId)
                ).length === 0
            }
            onClick={addSelectedMembers}
          >
            Add selected members
          </Button>
        </div>
      </motion.div>
      {errorAddMembers && (
        <InfoModal
          message={errorAddMembers.message}
          openModal={isErrorModalOpen}
          setOpenModal={setIsErrorModalOpen}
        />
      )}

      {status === "loading" ? (
        <span className="flex h-screen items-center justify-center">
          <Spinner
            color="failure"
            aria-label="Extra large spinner example"
            size="xl"
          />
        </span>
      ) : status === "error" ? (
        <InfoModal
          message={error.message}
          openModal={isErrorModalOpen}
          setOpenModal={setIsErrorModalOpen}
        />
      ) : (
        <>
          {" "}
          <DataTable
            addMembers={group}
            allMembers={allMembers}
            groupId={groupId}
            checkboxStates={checkboxStates}
            onCheckboxChange={handleOnChange}
          />
        </>
      )}
    </div>
  );
};

export default AddMembers;
