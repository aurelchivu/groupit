import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import EditForm from "@/components/EditForm";

interface IMember {
  fullName: string;
  details: string;
}

const EditMember: NextPage = () => {
  const [id, setId] = useState<string>("");
  const [formData, setFormData] = useState<IMember>({
    fullName: "",
    details: "",
  });
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );

  const router = useRouter();
  const { memberId } = router.query;

  const { data: member } = trpc.members.getById.useQuery(id);

  const memberFullName = member?.fullName as string;
  const memberDetails = member?.details as string;

  const updateMember = trpc.members.update.useMutation({
    onSuccess: (data) => {
      router.push(`/members/${data?.id}`);
    },
  });

  const { error } = updateMember;

  useEffect(() => {
    if (typeof memberId === "string") {
      setId(memberId);
      setFormData({ fullName: memberFullName, details: memberDetails });
    }
  }, [memberId, memberFullName, memberDetails]);

  const submitUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateMember.mutateAsync({ id: memberId as string, ...formData });
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

export default EditMember;
