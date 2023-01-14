import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Spinner } from "flowbite-react";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";
import DeleteModal from "@/components/DeleteModal";
import type { Group } from "@/types/prismaTypes";
import Details from "@/components/DetailCard";

const LeaderDetails: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<string | undefined>();

  const router = useRouter();
  const { groupId } = router.query;

  interface IState {
    groupId: string;
  }

  const [ids, setIds] = useState<IState>({
    groupId: "",
  });

  const { status, data, error } = trpc.groups.getById.useQuery(ids.groupId);
  const group = data as Group | undefined;
  console.log("Group=", group);

  const leader = group?.members?.find(
    (member) => member?.member?.id === group.leaderId
  );
  console.log("Leader=", leader);

  const removeLeader = trpc.groups.removeMember.useMutation();

  useEffect(() => {
    if (typeof groupId === "string") {
      setIds({ groupId: groupId as string });
    }
  }, [groupId]);

  const handleRemove = async () => {
    await removeLeader.mutateAsync({
      groupId: groupId as string,
      membersToRemove: [leader?.id as string],
    });
    setIsModalOpen(undefined);
    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="p-4">
      <Button size="lg" onClick={() => router.back()}>
        Go Back
      </Button>

      {status === "loading" ? (
        <span className="flex h-screen items-center justify-center">
          <Spinner
            color="failure"
            aria-label="Extra large spinner example"
            size="xl"
          />
        </span>
      ) : status === "error" ? (
        <ErrorModal errorMessage={error.message} />
      ) : (
        <>
          <div className="max-w-xxl my-5 w-full rounded-lg border bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6">
            <h5 className="mb-3 ml-3 text-base font-semibold text-gray-900 dark:text-white md:text-xl">
              {`${group?.name}'s Leader Details`}
            </h5>
            <Details leader={leader} />
          </div>

          <div className="align-center flex justify-between">
            <Button
              size="lg"
              color="success"
              onClick={() =>
                router.push(`/groups/${groupId}/group-leader/edit`)
              }
            >
              Edit Leader
            </Button>
            <Button
              color="failure"
              size="lg"
              onClick={() => setIsModalOpen("default")}
            >
              Remove From Group
            </Button>
          </div>
        </>
      )}

      <DeleteModal
        message={`Are you sure you want to remove ${leader?.member?.fullName} from ${group?.name}?`}
        handleAction={handleRemove}
        openModal={isModalOpen}
        setOpenModal={setIsModalOpen}
      />
    </div>
  );
};

export default LeaderDetails;
