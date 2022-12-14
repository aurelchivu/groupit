import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Spinner } from "flowbite-react";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";
import DeleteModal from "@/components/DeleteModal";

const MemberDetails: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<string | undefined>();

  const router = useRouter();
  const { memberId } = router.query;

  const [id, setId] = useState<string>("");

  const { status, data: member, error } = trpc.members.getById.useQuery(id);
  console.log("Member=", member);

  const deleteMember = trpc.members.delete.useMutation();

  useEffect(() => {
    if (typeof memberId === "string") {
      setId(memberId);
    }
  }, [memberId]);

  const handleRemove = async () => {
    await deleteMember.mutateAsync(id as string);
    setIsModalOpen(undefined);
    router.push("/members");
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
              Member Details
            </h5>
            <ul className="my-4 space-y-3">
              <li key="Member name">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Member name: {member?.fullName}
                </span>
              </li>
              <li key="Member id">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Member id: {member?.id}
                </span>
              </li>
              <li key="Description">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Details: {member?.details}
                </span>
              </li>
              <li key="Created by">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Created by: {member?.createdBy?.name}
                </span>
              </li>

              {member?.groups && member?.groups?.length > 0 ? (
                <li key="MemberOf">
                  <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                    Member of:
                    {member?.groups?.map((group, index) => (
                      <>
                        <Link
                          key={group.id}
                          href={`/groups/${group?.group?.id}`}
                          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                        >
                          {group?.group?.name}
                        </Link>
                        {index === Number(member?.groups?.length) - 1
                          ? null
                          : ", "}
                      </>
                    ))}
                  </span>
                </li>
              ) : null}

              {member?.leaderOf && member?.leaderOf?.length > 0 ? (
                <li key="LeaderOf">
                  <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                    Leader of:{" "}
                    {member?.leaderOf?.map((group, index) => (
                      <>
                        <Link
                          key={group.id}
                          href={`/groups/${group?.id}`}
                          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                        >
                          {group?.name}
                        </Link>
                        {index === Number(member?.leaderOf.length) - 1
                          ? null
                          : ", "}
                      </>
                    ))}
                  </span>
                </li>
              ) : null}

              <li key="Created at">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Created at: {member?.createdAt.toLocaleString()}
                </span>
              </li>
              <li key="Last update">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Last update : {member?.updatedAt.toLocaleString()}
                </span>
              </li>
            </ul>
          </div>

          <div className="align-center flex justify-between">
            <Button
              size="lg"
              color="success"
              onClick={() => router.push(`/members/${memberId}/edit`)}
            >
              Edit Member
            </Button>
            <Button color="failure" onClick={() => setIsModalOpen("default")}>
              Delete Member
            </Button>
          </div>
        </>
      )}

      <DeleteModal
        message={`Are you sure you want to remove ${member?.fullName}?`}
        handleAction={handleRemove}
        openModal={isModalOpen}
        setOpenModal={setIsModalOpen}
      />
    </div>
  );
};

export default MemberDetails;
