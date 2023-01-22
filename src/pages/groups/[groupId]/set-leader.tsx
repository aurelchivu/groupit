import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import DataTable from "@/components/DataTable";
import type { Group } from "@/types/prismaTypes";

const SetLeader: NextPage = () => {
  const [id, setId] = useState<string>("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState<
    string | undefined
  >(undefined);
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});
  console.log("Checked", checkboxStates);

  const router = useRouter();
  const groupId = router.query.groupId as string | undefined;

  const { data } = trpc.groups.getById.useQuery(id);
  const group = data as Group | undefined;
  console.log("Group", group);

  const setLeader = trpc.groups.setLeader.useMutation();
  const { error } = setLeader;

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId);
    }
    if (group?.members?.length === 0) {
      setIsLeaderModalOpen("open");
    }
  }, [group?.members?.length, groupId]);

  const handleOnChange = useCallback((memberId: string) => {
    console.log("MemberId", memberId);
    setCheckboxStates((prevState) => ({
      [memberId]: !prevState[memberId],
    }));
  }, []);

  const setSelectedLeader = async () => {
    const selectedMembers = Object.entries(checkboxStates)
      .filter(([_, isChecked]) => isChecked)
      .map(([memberId, _]) =>
        group?.members?.find((member) => member.id === memberId)
      );
    console.log("Selected Members", selectedMembers);

    await setLeader.mutateAsync({
      groupId: groupId as string,
      leaderId: selectedMembers[0]?.memberId as string,
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

      <div className="flex items-center justify-between">
        <Button size="lg" onClick={() => router.push(`/groups/${groupId}`)}>
          Go Back To {group?.name}
        </Button>
        <div className="py-4">
          <Button
            size="lg"
            color="success"
            disabled={
              Object.entries(checkboxStates)
                .filter(([_, isChecked]) => isChecked)
                .map(([memberId, _]) =>
                  group?.members?.find((member) => member.id === memberId)
                ).length !== 1
            }
            onClick={setSelectedLeader}
          >
            Set Selected Member as Leader
          </Button>
        </div>
      </div>
      <h1 className="p-2 text-xl">{`Set ${group?.name}'s Leader`} </h1>
      {group?.members && (
        <DataTable
          setLeader={group}
          groupId={groupId}
          checkboxStates={checkboxStates}
          onCheckboxChange={handleOnChange}
        />
      )}
      {group?.members?.length === 0 && (
        <InfoModal
          message="No members in this group yet. The leader will be set once you add members."
          openModal={isLeaderModalOpen}
          setOpenModal={setIsLeaderModalOpen}
          // handleAction={() => router.push(`/groups/${groupId}/add-members`)}
        />
      )}
    </div>
  );
};

export default SetLeader;
