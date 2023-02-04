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

const EditGroupLeader: NextPage = () => {
  const [formData, setFormData] = useState<IFormData>({
    fullName: "",
    details: "",
  });
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );

  const router = useRouter();
  const { groupId } = router.query;

  interface IState {
    groupId: string;
  }

  const [ids, setIds] = useState<IState>({
    groupId: "",
  });

  const { data: group } = trpc.groups.getById.useQuery(ids.groupId);
  console.log("Group=", group);

  const leader = group?.members?.find(
    (member) => member?.member?.id === group.leaderId
  );
  console.log("Leader=", leader);

  const leaderFullName = leader?.member?.fullName as string;
  const leaderDetails = leader?.member?.details as string;

  const updateMember = trpc.members.update.useMutation();
  const { error } = updateMember;

  useEffect(() => {
    if (typeof groupId === "string") {
      setIds({ groupId: groupId as string });
      setFormData({ fullName: leaderFullName, details: leaderDetails });
    }
  }, [groupId, leaderFullName, leaderDetails]);

  const submitUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateMember.mutateAsync({
      id: leader?.member?.id as string,
      ...formData,
    });
    router.push(`/groups/${groupId}/group-leader`);
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
        name={leaderFullName}
        memberFormData={formData}
        setMemberFormData={setFormData}
        submitUpdate={submitUpdate}
      />
    </div>
  );
};

export default EditGroupLeader;
