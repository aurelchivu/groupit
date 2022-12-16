import { type NextPage } from "next";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const CreateGroup: NextPage = () => {
  interface IGroup {
    groupName: string;
    description?: string;
  }

  const [formData, setFormData] = useState<IGroup>({
    groupName: "",
    description: "",
  });

  const router = useRouter();
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
            <Label htmlFor="base" value="Group name" />
          </div>
          <TextInput
            id="base"
            type="text"
            placeholder="Group Name"
            required={true}
            value={formData.groupName}
            onChange={(e) => {
              setFormData({ ...formData, groupName: e.target.value });
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Group Description" />
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
        <Button type="submit" size="lg" color="success">
          Create Group
        </Button>
      </form>
    </div>
  );
};

export default CreateGroup;
