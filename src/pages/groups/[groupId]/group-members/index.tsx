import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import DataTable from "@/components/DataTable";
import type { Group } from "@/types/prismaTypes";
import { motion } from "framer-motion";

const GroupMembers: NextPage = () => {
  const [id, setId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<
    string | undefined
  >(undefined);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );

  const router = useRouter();
  const groupId = router.query.groupId as string | undefined;

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId);
    }
  }, [groupId]);

  const { status, data, error } = trpc.groups.getById.useQuery(id);
  const group = data as Group | undefined;
  // console.log("Group", group);

  const removeMembers = trpc.groups.removeMember.useMutation({
    onSuccess: () => {
      router.push(`/groups/${groupId}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});
  // console.log("Checked", checkboxStates);

  const handleOnChange = useCallback((memberId: string) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [memberId]: !prevState[memberId],
    }));
  }, []);

  const removeSelectedMembers = async () => {
    const selectedMembers = Object.entries(checkboxStates)
      .filter(([_, isChecked]) => isChecked)
      .map(([memberId, _]) =>
        group?.members?.find((member) => member.id === memberId)
      );
    // console.log("Selected Members", selectedMembers);

    await removeMembers.mutateAsync({
      groupId: groupId as string,
      membersToRemove: selectedMembers.map((member) => member?.id) as string[],
    });
  };

  return status === "loading" ? (
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
      <div className="p-4">
        <motion.div
          className="py-4"
          initial={{ translateX: -500 }}
          animate={{ translateX: 0 }}
          transition={{ duration: 1 }}
        >
          <Button size="lg" onClick={() => router.push(`/groups/${groupId}`)}>
            Go back to {group?.name}
          </Button>
        </motion.div>
        <motion.h1
          className="p-2 text-xl"
          initial={{ translateX: 1500 }}
          animate={{ translateX: 0 }}
          transition={{ duration: 0.8 }}
        >{`${group?.name}'s members`}</motion.h1>

        <>
          <DataTable
            groupMembers={group}
            groupId={groupId}
            checkboxStates={checkboxStates}
            onCheckboxChange={handleOnChange}
          />
          <motion.div
            className="flex items-center justify-between"
            initial={{ translateY: 2000 }}
            animate={{ translateY: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="py-4">
              <Button
                size="lg"
                color="success"
                onClick={() => router.push(`/groups/${groupId}/add-members`)}
              >
                Add new members
              </Button>
            </div>

            <div className="py-4">
              <Button
                size="lg"
                color="failure"
                disabled={
                  Object.entries(checkboxStates)
                    .filter(([_, isChecked]) => isChecked)
                    .map(([memberId, _]) =>
                      group?.members?.find((member) => member.id === memberId)
                    ).length === 0
                }
                onClick={() => setIsDeleteModalOpen("open")}
              >
                Remove selected members
              </Button>
            </div>
          </motion.div>
        </>
      </div>
      <InfoModal
        message={`Are you sure you want to remove the selected member(s)?`}
        handleAction={removeSelectedMembers}
        openModal={isDeleteModalOpen}
        setOpenModal={setIsDeleteModalOpen}
      />
    </>
  );
};

export default GroupMembers;
