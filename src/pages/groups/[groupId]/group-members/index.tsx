import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import DeleteModal from "@/components/DeleteModal";
import DataTable from "@/components/DataTable";
import type { Group } from "@/types/prismaTypes";

const GroupMembers: NextPage = () => {
  const [id, setId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<string | undefined>();

  const router = useRouter();
  const groupId = router.query.groupId as string | undefined;

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId);
    }
  }, [groupId]);

  const { status, data, error } = trpc.groups.getById.useQuery(id);
  const group = data as Group | undefined;
  console.log("Group", group);

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
  console.log("Checked", checkboxStates);

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
    console.log("Selected Members", selectedMembers);

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
    <InfoModal message={error.message} />
  ) : (
    <>
      <div className="p-4">
        <div className="py-4">
          <Button size="lg" onClick={() => router.push(`/groups/${groupId}`)}>
            Go Back To {group?.name}
          </Button>
        </div>
        <h1 className="p-2 text-xl">{`${group?.name}'s Members`}</h1>

        <>
          <DataTable
            groupMembers={group}
            groupId={groupId}
            checkboxStates={checkboxStates}
            onCheckboxChange={handleOnChange}
          />
          <div className="flex items-center justify-between">
            <div className="py-4">
              <Button
                size="lg"
                color="success"
                onClick={() => router.push(`/groups/${groupId}/add-members`)}
              >
                Add New Members
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
                onClick={() => setIsModalOpen("open")}
              >
                Remove Selected Members
              </Button>
            </div>
          </div>
        </>
      </div>
      <DeleteModal
        message={`Are you sure you want to remove the selected member(s)?`}
        handleAction={removeSelectedMembers}
        openModal={isModalOpen}
        setOpenModal={setIsModalOpen}
      />
    </>
  );
};

export default GroupMembers;
