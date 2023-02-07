import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import DataTable from "@/components/DataTable";
import type { Group } from "@/types/prismaTypes";
import { motion } from "framer-motion";

const ChangeLeader: NextPage = () => {
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
      setId(groupId);
    }
  }, [groupId]);

  const { data } = trpc.groups.getById.useQuery(id);
  const group = data as Group | undefined;
  // console.log("Group", group);
  const groupName = group?.name;

  const changeLeader = trpc.groups.changeLeader.useMutation();
  const { error } = changeLeader;

  const handleOnChange = useCallback((memberId: string) => {
    // console.log("MemberId", memberId);
    setCheckboxStates((prevState) => ({
      [memberId]: !prevState[memberId],
    }));
  }, []);

  const changeSelectedLeader = async () => {
    const selectedMember = Object.entries(checkboxStates)
      .filter(([_, isChecked]) => isChecked)
      .map(([memberId, _]) =>
        group?.members
          .filter((member) => member.isLeader === false)
          ?.find((member) => member.id === memberId)
      );
    // console.log("Selected Members", selectedMember);

    await changeLeader.mutateAsync({
      groupId: groupId as string,
      leaderId: group?.leaderId as string,
      newLeaderId: selectedMember[0]?.memberId as string,
    });
    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="p-4">
      {error && (
        <InfoModal
          message={error.message}
          openModal={isErrorModalOpen}
          setOpenModal={setIsErrorModalOpen}
        />
      )}

      <motion.div
        className="flex items-center justify-between"
        initial={{ translateY: -500 }}
        animate={{ translateY: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Button size="lg" onClick={() => router.push(`/groups/${groupId}`)}>
          Go back to {groupName}
        </Button>
        <div className="py-4">
          <Button
            disabled={
              Object.entries(checkboxStates)
                .filter(([_, isChecked]) => isChecked)
                .map(([memberId, _]) =>
                  group?.members
                    .filter((member) => member.isLeader === false)
                    ?.find((member) => member.id === memberId)
                ).length !== 1
            }
            size="lg"
            color="success"
            onClick={changeSelectedLeader}
          >
            Set selected member as new leader
          </Button>
        </div>
      </motion.div>
      <motion.h1
        className="p-2 text-xl"
        initial={{ translateX: 1500 }}
        animate={{ translateX: 0 }}
        transition={{ duration: 0.8 }}
      >{`Change ${group?.name}'s leader`}</motion.h1>

      {group?.members.filter((member) => member.isLeader === false) ? (
        <>
          <DataTable
            changeLeader={group}
            groupId={groupId}
            checkboxStates={checkboxStates}
            onCheckboxChange={handleOnChange}
          />
        </>
      ) : null}
    </div>
  );
};

export default ChangeLeader;
