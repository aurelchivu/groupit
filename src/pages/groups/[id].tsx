import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { trpc } from "../../utils/trpc";

const GroupDetails: NextPage = () => {
  const [openModal, setOpenModal] = useState<string | undefined>();

  const router = useRouter();
  const [groupId, setGroupId] = useState<string>("");

  const { id } = router.query;
  const group = trpc.groups.getById.useQuery(groupId as string);
  console.log(group);

  const deleteGroup = trpc.groups.delete.useMutation();

  useEffect(() => {
    if (id) {
      setGroupId(id as string);
    }
  }, [id]);

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
          onClick={() => router.push(`/groups/edit/${group.data?.id}`)}
        >
          Edit Group
        </Button>
        <Button color="warning" onClick={() => setOpenModal("default")}>
          Delete Group
        </Button>
      </div>
      <div className="max-w-xxl my-5 w-full rounded-lg border bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h5 className="mb-3 ml-3 text-base font-semibold text-gray-900 dark:text-white md:text-xl">
          Group Details
        </h5>
        <ul className="my-4 space-y-3">
          <li>
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Group name: {group.data?.name}
            </span>
          </li>
          <li>
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Group id: {group.data?.id}
            </span>
          </li>
          <li>
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Description: {group.data?.description}
            </span>
          </li>
          <li>
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created by: {group.data?.createdBy.name}
            </span>
          </li>
          <li>
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
                " Not set yet"
              )}
            </span>
          </li>
          <li>
            <span className="group ml-3 flex  flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Members:{" "}
              {group.data?.members.map((member) => (
                <Link
                  key={member.id}
                  href={`/members/${member.id}`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  {member.member?.fullName}
                </Link>
              ))}
            </span>
          </li>
          <li>
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created at: {group.data?.createdAt.toLocaleString()}
            </span>
          </li>
          <li>
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Last update : {group.data?.updatedAt.toLocaleString()}
            </span>
          </li>
        </ul>
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
