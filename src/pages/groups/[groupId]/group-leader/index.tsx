import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Spinner } from "flowbite-react";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";
import DeleteModal from "@/components/DeleteModal";

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

  const {
    status,
    data: group,
    error,
  } = trpc.groups.getById.useQuery(ids.groupId);
  console.log("Group=", group);

  const leader = group?.members?.find(
    (member) => member?.member?.id === group.leaderId
  );
  console.log("Leader=", leader);
  const memberOf = leader?.member?.groups;
  const leaderOf = leader?.member?.leaderOf;

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
              {`${group.name}'s Leader Details`}
            </h5>
            <ul className="my-4 space-y-3">
              <li key="Leader name">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Leader name: {leader?.member?.fullName}
                </span>
              </li>
              <li key="Leader id">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Group Leader id: {leader?.member?.id}
                </span>
              </li>
              <li key="Description">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Details: {leader?.member?.details}
                </span>
              </li>
              <li key="Created by">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Created by: {leader?.member?.createdBy?.name}
                </span>
              </li>
              <li key="LeaderOf">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Member of:
                  {memberOf?.map((group, index) => (
                    <>
                      <Link
                        key={group.id}
                        href={`/groups/${group?.group?.id}`}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {group?.group?.name}
                      </Link>
                      {index < Number(memberOf?.length) - 1 ? "," : null}
                    </>
                  ))}
                </span>
              </li>

              {leaderOf && leaderOf?.length > 0 ? (
                <li key="LeaderOf">
                  <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                    Leader of:
                    {leaderOf?.map((group, index) => (
                      <>
                        <Link
                          key={group.id}
                          href={`/groups/${group?.id}`}
                          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                        >
                          {group?.name}
                        </Link>
                        {index < Number(leaderOf.length) - 1 ? ", " : null}
                      </>
                    ))}
                  </span>
                </li>
              ) : null}

              <li key="Added">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Added to group: {leader?.createdAt.toLocaleString()}
                </span>
              </li>

              <li key="Created at">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Created at: {leader?.member?.createdAt.toLocaleString()}
                </span>
              </li>
              <li key="Last update">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Last update : {leader?.member?.updatedAt.toLocaleString()}
                </span>
              </li>
            </ul>
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
            <Button color="failure" onClick={() => setIsModalOpen("default")}>
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
