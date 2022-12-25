import { type NextPage } from "next";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const CreateGroup: NextPage = () => {
  const router = useRouter();
  const members = trpc.members.getAll.useQuery();

  interface IGroup {
    groupName: string;
    description?: string;
    leader?: string | undefined;
    leaderId?: string | undefined;
    groupMembers?: string[] | undefined;
  }

  const [formData, setFormData] = useState<IGroup>({
    groupName: "",
    description: "",
    leader: "",
    groupMembers: [],
  });

  const createGroup = trpc.groups.create.useMutation({
    onSuccess: (data) => {
      router.push(`/groups/${data?.id}`);
    },
  });

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await createGroup.mutateAsync({
      name: formData.groupName,
      description: formData.description,
      leaderId: formData.leaderId,
      members: ["formData.leaderId"],
    });
  };

  return (
    <div className="px-40">
      <div className="py-4">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>

      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <h1 className="text-xl">Create New Group</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Name" />
          </div>
          <TextInput
            id="base"
            type="text"
            placeholder="Name"
            required={true}
            value={formData.groupName}
            onChange={(e) => {
              setFormData({ ...formData, groupName: e.target.value });
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Description" />
          </div>
          <textarea
            id="message"
            rows={3}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Description..."
            value={formData.description}
            onChange={(e) => {
              setFormData({
                ...formData,
                description: e.target.value,
              });
            }}
          ></textarea>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Please Select a Leader" />
          </div>
          <select
            className="rounded-md"
            value={formData.leader}
            color="light"
            onChange={(e) => {
              setFormData({
                ...formData,
                leader: e.currentTarget.value,
                leaderId: members.data?.find(
                  (member) => member.fullName === e.currentTarget.value
                )?.id,
                groupMembers: [
                  members.data?.find(
                    (member) => member.fullName === e.currentTarget.value
                  )?.id as string,
                ],
              });
            }}
          >
            <option>Select Leader</option>
            {members.data?.map((member) => (
              <option key={member.id}>{member.fullName}</option>
            ))}
          </select>
        </div>
        <Button type="submit" size="lg" color="success">
          Create Group
        </Button>
      </form>
    </div>
  );
};

export default CreateGroup;
