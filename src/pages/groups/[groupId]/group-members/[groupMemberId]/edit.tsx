import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import EditForm from "@/components/EditForm";

interface IFormData {
  fullName: string;
  details: string;
}

interface IState {
  grouppId: string;
  memberId: string;
}

const EditGroupMember: NextPage = () => {
  const [formData, setFormData] = useState<IFormData>({
    fullName: "",
    details: "",
  });
  const [ids, setIds] = useState<IState>({
    grouppId: "",
    memberId: "",
  });
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );

  const router = useRouter();
  const { groupId, groupMemberId } = router.query;

  const { data: group } = trpc.groups.getById.useQuery(ids.grouppId);
  // console.log("Group=", group);

  const member = trpc.groups.getById
    .useQuery(ids.grouppId as string)
    .data?.members.find((member) => member.memberId === ids.memberId);
  // console.log("Member=", member);

  const memberFullName = member?.member?.fullName as string;
  const memberDetails = member?.member?.details as string;

  const updateMember = trpc.members.update.useMutation();
  const { error } = updateMember;

  useEffect(() => {
    if (typeof groupMemberId === "string") {
      setIds({ grouppId: groupId as string, memberId: groupMemberId });
      setFormData({ fullName: memberFullName, details: memberDetails });
    }
  }, [groupId, groupMemberId, memberFullName, memberDetails]);

  const submitUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateMember.mutateAsync({
      id: groupMemberId as string,
      ...formData,
    });
    router.push(`/groups/${groupId}/group-members/${groupMemberId}`);
  };

  return (
    <div className="px-40 py-4">
      {error && (
        <InfoModal
          message={error.message}
          openModal={isErrorModalOpen}
          setOpenModal={setIsErrorModalOpen}
        />
      )}
      <EditForm
        name={memberFullName}
        memberFormData={formData}
        setMemberFormData={setFormData}
        submitUpdate={submitUpdate}
      />
    </div>
  );
};

export default EditGroupMember;
