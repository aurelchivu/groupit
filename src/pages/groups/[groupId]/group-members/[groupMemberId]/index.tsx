import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "flowbite-react";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import type { Group } from "@/types/prismaTypes";
import Details from "@/components/DetailCard";

const GroupMemberDetails: NextPage = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<
    string | undefined
  >(undefined);

  const router = useRouter();
  const { groupId, groupMemberId } = router.query;

  interface IState {
    grouppId: string;
    memberId: string;
  }

  const [ids, setIds] = useState<IState>({
    grouppId: "",
    memberId: "",
  });

  const { data } = trpc.groups.getById.useQuery(ids.grouppId);
  const group = data as Group | undefined;

  console.log("Group=", group);

  const member = group?.members.find(
    (member) => member.memberId === ids.memberId
  );
  console.log("Member=", member);

  const removeMember = trpc.groups.removeMember.useMutation();

  useEffect(() => {
    if (typeof groupMemberId === "string") {
      setIds({ grouppId: groupId as string, memberId: groupMemberId });
    }
  }, [groupId, groupMemberId]);

  const handleRemove = async () => {
    await removeMember.mutateAsync({
      groupId: groupId as string,
      membersToRemove: [member?.id as string],
    });
    setIsDeleteModalOpen(undefined);
    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="p-4">
      <Button size="lg" onClick={() => router.back()}>
        Go Back
      </Button>

      <div className="max-w-xxl my-5 w-full rounded-lg border bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h5 className="mb-3 ml-3 text-base font-semibold text-gray-900 dark:text-white md:text-xl">
          Member Details
        </h5>
        <Details groupMember={member} />
      </div>

      <div className="align-center flex justify-between">
        <Button
          size="lg"
          color="success"
          onClick={() =>
            router.push(
              `/groups/${groupId}/group-members/${groupMemberId}/edit`
            )
          }
        >
          Edit Member
        </Button>
        <Button
          color="failure"
          size="lg"
          onClick={() => setIsDeleteModalOpen("open")}
        >
          Remove From Group
        </Button>
      </div>

      <InfoModal
        message={`Are you sure you want to remove ${member?.member?.fullName} from ${group?.name}?`}
        handleAction={handleRemove}
        openModal={isDeleteModalOpen}
        setOpenModal={setIsDeleteModalOpen}
      />
    </div>
  );
};

export default GroupMemberDetails;
