import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";

const EditMember: NextPage = () => {
  const router = useRouter();
  const { memberId } = router.query;

  interface IFormData {
    fullName: string;
    details: string;
  }

  const [formData, setFormData] = useState<IFormData>({
    fullName: "",
    details: "",
  });

  const [id, setId] = useState<string>("");

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

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateMember.mutateAsync({ id: memberId as string, ...formData });
  };

  return (
    <div className="px-40 py-4">
      <div className="align-center flex justify-between">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>

      {error && <ErrorModal errorMessage={error.message} />}

      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <h1 className="text-xl">Edit Member {memberFullName}</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="firstName" value="Member First Name" />
          </div>
          <TextInput
            id="memberFirstName"
            type="text"
            required={true}
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
            }}
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Member Details" />
          </div>
          <textarea
            id="details"
            rows={3}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={formData.details}
            onChange={(e) => {
              setFormData({
                ...formData,
                details: e.target.value,
              });
            }}
          ></textarea>
        </div>

        <Button type="submit" size="lg">
          Edit Member
        </Button>
      </form>
    </div>
  );
};

export default EditMember;
