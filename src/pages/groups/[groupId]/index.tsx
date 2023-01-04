import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Modal, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";

const GroupDetails: NextPage = () => {
  const [openModal, setOpenModal] = useState<string | undefined>();

  const router = useRouter();
  const { groupId } = router.query;

  const [id, setId] = useState<string>("");

  const { status, data: group, error } = trpc.groups.getById.useQuery(id);
  console.log("Group=", group);

  const deleteGroup = trpc.groups.delete.useMutation();

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId);
    }
  }, [groupId]);

  const handleDelete = async () => {
    await deleteGroup.mutateAsync(id as string);
    setOpenModal(undefined);
    router.push("/groups");
  };

  return (
    <div className="p-4">
      <Button size="lg" onClick={() => router.push(`/groups`)}>
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
              {group?.name} Group Details
            </h5>
            <ul className="my-4 space-y-3">
              <li key="Group name">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Group name: {group?.name}
                </span>
              </li>
              <li key="Group id">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Group id: {group?.id}
                </span>
              </li>
              <li key="Description">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Description: {group?.description}
                </span>
              </li>
              <li key="Created by">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Created by: {group?.createdBy.name}
                </span>
              </li>

              <li key="Leader">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Leader:
                  {group?.leader ? (
                    <Link
                      href={`/groups/${group?.id}/group-leader`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {group?.leader?.fullName}
                    </Link>
                  ) : (
                    " Not set yet "
                  )}
                </span>
              </li>

              <li key="Members">
                <span className="group ml-3 flex  flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  {group?.members.length === 0 ? (
                    "No Members"
                  ) : (
                    <Link
                      href={`/groups/${group?.id}/group-members`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {group?.members.length && group?.members.length > 1
                        ? `${group?.members.length} Members`
                        : "1 Member"}
                    </Link>
                  )}
                </span>
              </li>

              <li key="Created at">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Created at: {group?.createdAt.toLocaleString()}
                </span>
              </li>
              <li key="Last update">
                <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                  Last update : {group?.updatedAt.toLocaleString()}
                </span>
              </li>
            </ul>
          </div>

          <div className="align-center flex justify-between">
            <Button
              size="lg"
              color="success"
              onClick={() => router.push(`/groups/${group?.id}/edit`)}
            >
              Edit Group
            </Button>

            <Button color="failure" onClick={() => setOpenModal("default")}>
              Delete Group
            </Button>
          </div>
        </>
      )}

      <Modal
        show={openModal === "default"}
        onClose={() => setOpenModal(undefined)}
      >
        <Modal.Header>Delete Confirmation</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the group {group?.name}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={handleDelete}>
                OK, do it!
              </Button>
              <Button color="failure" onClick={() => setOpenModal(undefined)}>
                NO, get me out of here!
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GroupDetails;
