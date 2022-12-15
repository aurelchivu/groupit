import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const EditGroup: NextPage = () => {
  const router = useRouter();

  interface IGroup {
    name: string;
    leaderId: string;
  }

  const [formData, setFormData] = useState<IGroup>({
    name: "",
    leaderId: "",
  });

  const [groupId, setGroupId] = useState("");

  const { id } = router.query;
  const group = trpc.groups.getById.useQuery(groupId as string);

  const groupName = group?.data?.name as string;
  const groupLeaderId = group?.data?.leaderId as string;

  const updateGroup = trpc.groups.update.useMutation();

  useEffect(() => {
    if (id) {
      setGroupId(id as string);
      setFormData({ name: groupName, leaderId: groupLeaderId });
    }
  }, [id, groupName, groupLeaderId]);

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateGroup.mutateAsync({ id: groupId as string, ...formData });
    router.back();
  };

  return (
    <div className="px-40 py-4">
      <Button size="lg" onClick={() => router.back()}>
        Go Back
      </Button>

      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <h1 className="text-xl">Edit Group: {groupName}</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Group name" />
          </div>
          <TextInput
            id="groupName"
            type="text"
            required={true}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
        </div>

        <Button type="submit" size="lg">
          Save
        </Button>
      </form>
    </div>
  );
};

export default EditGroup;
