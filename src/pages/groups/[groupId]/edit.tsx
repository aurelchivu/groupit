import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const EditGroup: NextPage = () => {
  const router = useRouter();

  interface IGroup {
    name: string;
    description: string;
    leaderId: string;
  }

  const [id, setId] = useState("");

  const [formData, setFormData] = useState<IGroup>({
    name: "",
    description: "",
    leaderId: "",
  });

  const { groupId } = router.query;

  const group = trpc.groups.getById.useQuery(id as string);
  const groupName = group?.data?.name;
  const groupDescription = group?.data?.description;
  const groupLeaderId = group?.data?.leaderId;
  console.log(group);

  const updateGroup = trpc.groups.update.useMutation();

  useEffect(() => {
    if (groupId) {
      setId(groupId as string);
      setFormData({
        name: groupName as string,
        description: groupDescription as string,
        leaderId: groupLeaderId as string,
      });
    }
  }, [groupId, groupName, groupDescription, groupLeaderId]);

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateGroup.mutateAsync({ id: groupId as string, ...formData });
    router.back();
  };

  return (
    <div className="px-40 py-4 ">
      <div className="align-center flex justify-between">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button color="success" onClick={() => router.push("/members")}>
          Add Members
        </Button>
      </div>

      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <h1 className="text-xl">Edit Group: {groupName}</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Group name" />
          </div>
          <TextInput
            id="name"
            type="text"
            required={true}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Group Description" />
          </div>
          <textarea
            id="description"
            rows={3}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => {
              setFormData({
                ...formData,
                description: e.target.value,
              });
            }}
          ></textarea>
        </div>

        <Button type="submit" size="lg">
          Save
        </Button>
      </form>
    </div>
  );
};

export default EditGroup;
