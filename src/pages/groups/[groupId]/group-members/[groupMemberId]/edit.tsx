import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, Modal, TextInput, Toast } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../../../../utils/trpc";

const EditGroupMember: NextPage = () => {
  const router = useRouter();
  const { groupId, groupMemberId } = router.query;

  interface IFormData {
    fullName: string;
    details: string;
  }

  const [formData, setFormData] = useState<IFormData>({
    fullName: "",
    details: "",
  });

  interface IState {
    grouppId: string;
    memberId: string;
  }

  const [ids, setIds] = useState<IState>({
    grouppId: "",
    memberId: "",
  });

  const group = trpc.groups.getById.useQuery(ids.grouppId as string).data;
  console.log("Group=", group);
  const member = trpc.groups.getById
    .useQuery(ids.grouppId as string)
    .data?.members.find((member) => member.memberId === ids.memberId);
  console.log("Member=", member);

  const memberFullName = member?.member?.fullName as string;
  const memberDetails = member?.member?.details as string;

  const updateMember = trpc.members.update.useMutation();

  useEffect(() => {
    if (typeof groupMemberId === "string") {
      setIds({ grouppId: groupId as string, memberId: groupMemberId });
      setFormData({ fullName: memberFullName, details: memberDetails });
    }
  }, [groupId, groupMemberId, memberFullName, memberDetails]);

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateMember.mutateAsync({
      id: groupMemberId as string,
      ...formData,
    });
    router.push(`/groups/${groupId}/group-members/${groupMemberId}`);
  };

  return (
    <div className="px-40 py-4">
      <div className="align-center flex justify-between">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <h1 className="text-xl">Edit Member: {memberFullName}</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="firstName" value="Member Full Name" />
          </div>
          <TextInput
            id="memberFullName"
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

export default EditGroupMember;
