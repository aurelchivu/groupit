import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { trpc } from "../../../utils/trpc";

const GroupDetails: NextPage = () => {
  const [openModal, setOpenModal] = useState<string | undefined>();

  const router = useRouter();

  const { groupId } = router.query;
  const [id, setId] = useState<string>("");

  const group = trpc.groups.getById.useQuery(id as string);
  console.log("Group length", group.data?.members.length);

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
      <div className="align-center flex justify-between">
        <Button
          size="lg"
          onClick={() => router.push(`/groups/${group.data?.id}/edit`)}
        >
          Edit Group
        </Button>
        <Button color="failure" onClick={() => setOpenModal("default")}>
          Delete Group
        </Button>
      </div>

      <div className="max-w-xxl my-5 w-full rounded-lg border bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h5 className="mb-3 ml-3 text-base font-semibold text-gray-900 dark:text-white md:text-xl">
          Group Details
        </h5>
        <ul className="my-4 space-y-3">
          <li key="Group name">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Group name: {group.data?.name}
            </span>
          </li>
          <li key="Group id">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Group id: {group.data?.id}
            </span>
          </li>
          <li key="Description">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Description: {group.data?.description}
            </span>
          </li>
          <li key="Created by">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created by: {group.data?.createdBy.name}
            </span>
          </li>
          <li key="Leader">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Leader:
              {group.data?.leader?.id ? (
                <Link
                  href={`/members/${group.data?.leader?.id}`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  {group.data?.leader?.fullName}
                </Link>
              ) : (
                " Not set yet "
              )}
            </span>
          </li>
          <li key="Members">
            <span className="group ml-3 flex  flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              {group.data?.members.length === 0 ? (
                "No Members"
              ) : (
                <Link
                  href={`/groups/${group.data?.id}/group-members`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  {/* {group.data?.members.length && group.data?.members.length > 1
                  ? "Members"
                  : "Member"} */}
                  {group.data?.members.length && group.data?.members.length > 1
                    ? `${group.data?.members.length} Members`
                    : "1 Member"}
                </Link>
              )}

              {/* {":"}
              {group.data?.members.map((member, index) => {
                console.log(member);
                return (
                  <>
                    <Link
                      key={member.id}
                      href={`/members/${member?.member?.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {member.member?.fullName}
                    </Link>
                    {index === Number(group.data?.members.length) - 1
                      ? ". "
                      : ","}
                  </>
                );
              })} */}
            </span>
          </li>
          <li key="Created at">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created at: {group.data?.createdAt.toLocaleString()}
            </span>
          </li>
          <li key="Last update">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Last update : {group.data?.updatedAt.toLocaleString()}
            </span>
          </li>
        </ul>
      </div>

      <div className="align-center flex justify-between">
        <Button
          size="lg"
          color="success"
          onClick={() => router.push(`/groups/${group.data?.id}/group-members`)}
        >
          {group.data?.members.length && group.data?.members.length > 1
            ? `Show ${group.data?.members.length} Members`
            : "Show 1 Member"}
        </Button>
        <Button
          color="warning"
          onClick={() => router.push(`/groups/${group.data?.id}/set-leader`)}
        >
          {group.data?.leader?.id ? "Change Leader" : "Set leader"}
        </Button>
      </div>

      <Modal
        show={openModal === "default"}
        onClose={() => setOpenModal(undefined)}
      >
        <Modal.Header>Delete Confirmation</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the group {group.data?.name}?
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
