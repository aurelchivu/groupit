import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Spinner } from "flowbite-react";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import Details from "@/components/DetailCard";
import type { Group } from "@/types/prismaTypes";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const GroupDetails: NextPage = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<
    string | undefined
  >(undefined);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );
  const [isAllowModalOpen, setIsAllowModalOpen] = useState<string | undefined>(
    undefined
  );
  const [id, setId] = useState<string>("");

  const router = useRouter();
  const { groupId } = router.query;
  const { data: session } = useSession();

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
    router.push("/groups");
  };

  return (
    <div className="p-4">
      <motion.div
        initial={{ translateX: -500 }}
        animate={{ translateX: 0 }}
        transition={{ duration: 1 }}
      >
        <Button size="lg" onClick={() => router.push(`/groups`)}>
          Go Back
        </Button>
      </motion.div>

      {status === "loading" ? (
        <span className="flex h-screen items-center justify-center">
          <Spinner
            color="failure"
            aria-label="Extra large spinner example"
            size="xl"
          />
        </span>
      ) : status === "error" ? (
        <InfoModal
          message={error.message}
          openModal={isErrorModalOpen}
          setOpenModal={setIsErrorModalOpen}
        />
      ) : (
        <>
          <motion.div
            className="max-w-xxl my-5 w-full rounded-lg border bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{ duration: 1.5 }}
          >
            <h5 className="mb-3 ml-3 text-base font-semibold text-gray-900 dark:text-white md:text-xl">
              {group?.name} Group Details
            </h5>
            <Details group={group} />
          </motion.div>

          <motion.div
            className="align-center flex justify-between"
            initial={{ translateY: 2000 }}
            animate={{ translateY: 0 }}
            transition={{ duration: 1 }}
          >
            <div>
              <Button
                size="lg"
                color="success"
                onClick={() => {
                  group?.createdById === session?.user?.id
                    ? router.push(`/groups/${group?.id}/edit`)
                    : setIsAllowModalOpen("open");
                }}
              >
                Edit Group
              </Button>
            </div>

            <Button
              color="failure"
              size="lg"
              onClick={() => {
                group?.createdById === session?.user?.id
                  ? setIsDeleteModalOpen("open")
                  : setIsAllowModalOpen("open");
              }}
            >
              Delete Group
            </Button>
          </motion.div>
        </>
      )}

      <InfoModal
        message={`Are you sure you want to delete ${group?.name}?`}
        handleAction={handleDelete}
        openModal={isDeleteModalOpen}
        setOpenModal={setIsDeleteModalOpen}
      />

      <InfoModal
        message="You are not allowed to edit or delete this group. Only the creator can edit or delete this group."
        openModal={isAllowModalOpen}
        setOpenModal={setIsAllowModalOpen}
      />
    </div>
  );
};

export default GroupDetails;
