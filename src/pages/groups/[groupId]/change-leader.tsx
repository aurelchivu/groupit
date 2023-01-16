import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import DataTable from "@/components/DataTable";
import type { Group } from "@/types/prismaTypes";

const ChangeLeader: NextPage = () => {
  const [id, setId] = useState<string>("");
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
  const groupName = group?.name;

  const changeLeader = trpc.groups.changeLeader.useMutation();
  const { error } = changeLeader;

  const handleOnChange = useCallback((memberId: string) => {
    console.log("MemberId", memberId);
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
    console.log("Selected Members", selectedMember);

    await changeLeader.mutateAsync({
      groupId: groupId as string,
      leaderId: group?.leaderId as string,
      newLeaderId: selectedMember[0]?.memberId as string,
    });
    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="p-4">
      {error && <InfoModal message={error.message} />}

      <div className="flex items-center justify-between">
        <Button size="lg" onClick={() => router.push(`/groups/${groupId}`)}>
          Go Back To {groupName}
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
            Set Selected Member as New Leader
          </Button>
        </div>
      </div>
      <h1 className="p-2 text-xl">{`Change ${group?.name}'s Leader`}</h1>

      {group?.members.filter((member) => member.isLeader === false) ? (
        <>
          <DataTable
            changeLeader={group}
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

export default ChangeLeader;
