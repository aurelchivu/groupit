import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Spinner } from "flowbite-react";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";
import DeleteModal from "@/components/DeleteModal";
import Details from "@/components/DetailCard";
import type { Group } from "@/types/prismaTypes";

const GroupDetails: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<string | undefined>();

  const router = useRouter();
  const { groupId } = router.query;

  const [id, setId] = useState<string>("");

  const { status, data, error } = trpc.groups.getById.useQuery(id);
  const group = data as Group | undefined;
  console.log("Group=", group);

  const deleteGroup = trpc.groups.delete.useMutation();

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId);
    }
  }, [groupId]);

  const handleDelete = async () => {
    await deleteGroup.mutateAsync(id);
    setIsModalOpen(undefined);
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
            <Details group={group} />
          </div>

          <div className="align-center flex justify-between">
            <Button
              size="lg"
              color="success"
              onClick={() => router.push(`/groups/${group?.id}/edit`)}
            >
              Edit Group
            </Button>

            <Button
              color="failure"
              size="lg"
              onClick={() => setIsModalOpen("default")}
            >
              Delete Group
            </Button>
          </div>
        </>
      )}

      <DeleteModal
        message={`Are you sure you want to delete the group ${group?.name}?`}
        handleAction={handleDelete}
        openModal={isModalOpen}
        setOpenModal={setIsModalOpen}
      />
    </div>
  );
};

export default GroupDetails;
