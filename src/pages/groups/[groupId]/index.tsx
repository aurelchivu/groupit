import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Spinner } from "flowbite-react";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import Details from "@/components/DetailCard";
import type { Group } from "@/types/prismaTypes";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { prisma } from "@/server/db/client";
import { appRouter } from "@/server/trpc/router/_app";
import superjson from "superjson";
import { PrismaClient } from "@prisma/client";

export const getStaticPaths: GetStaticPaths = async () => {
  const groups = await prisma?.groupp.findMany({
    include: {
      leader: true,
      createdBy: true,
      members: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return {
    paths: groups.map((group) => ({
      params: {
        groupId: group.id,
      },
    })),
    // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ groupId: string }>
) {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma: new PrismaClient() },
    transformer: superjson, // optional - adds superjson serialization
  });
  console.log("context = ", context);
  const id = context.params?.groupId as string;
  // prefetch `group.byId`
  await ssg.groups.getById.prefetch(id);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}

const GroupDetails = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<
    string | undefined
  >(undefined);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );
  const [isAllowModalOpen, setIsAllowModalOpen] = useState<string | undefined>(
    undefined
  );

  const router = useRouter();

  const { data: session } = useSession();

  const { id } = props;
  const { status, data, error } = trpc.groups.getById.useQuery(id);
  const group = data as Group | undefined;
  // console.log("Group=", group);

  const deleteGroup = trpc.groups.delete.useMutation();

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
        <Button size="lg" onClick={() => router.back()}>
          Go back
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
              {group?.name} group details
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
                Edit group
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
              Delete group
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
