import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Spinner } from "flowbite-react";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";
import DeleteModal from "@/components/DeleteModal";
import Details from "@/components/DetailCard";
import type { Member } from "@/types/prismaTypes";

const MemberDetails: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<string | undefined>();

  const router = useRouter();
  const { memberId } = router.query;

  const [id, setId] = useState<string>("");

  const { status, data, error } = trpc.members.getById.useQuery(id);
  const member = data as Member | undefined;

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
              {member?.fullName} Member Details
            </h5>
            <Details member={member} />
          </div>

          <div className="align-center flex justify-between">
            <Button
              size="lg"
              color="success"
              onClick={() => router.push(`/members/${memberId}/edit`)}
            >
              Edit Member
            </Button>
            <Button
              color="failure"
              size="lg"
              onClick={() => setIsModalOpen("default")}
            >
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
