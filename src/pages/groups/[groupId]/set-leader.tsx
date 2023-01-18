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
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});
  console.log("Checked", checkboxStates);

  const router = useRouter();
  const groupId = router.query.groupId as string | undefined;

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId);
    }
  }, [groupId]);

  const { data } = trpc.groups.getById.useQuery(id);
  const group = data as Group | undefined;
  console.log("Group", group);

  const setLeader = trpc.groups.setLeader.useMutation();
  const { error } = setLeader;

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
      {group?.members ? (
        <>
          <DataTable
            setLeader={group}
            groupId={groupId}
            checkboxStates={checkboxStates}
            onCheckboxChange={handleOnChange}
          />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SetLeader;
