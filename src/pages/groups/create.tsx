import { type NextPage } from "next";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const CreateGroup: NextPage = () => {
  const [formData, setFormData] = useState({ name: "", reportsTo: "" });
  const router = useRouter();
  const groups = trpc.groups.getAll.useQuery();
  const createGroup = trpc.groups.create.useMutation();

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await createGroup.mutateAsync(formData);
    router.push("/groups");
  };

  return (
    <div className="p-4">
      <div className="py-4 px-4">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>

      <form className="flex flex-col gap-5 p-40" onSubmit={submitCreate}>
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
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Reports to" />
          </div>
          <select
            className="rounded-md"
            value={formData.reportsTo}
            color="light"
            onChange={(e) => {
              setFormData({ ...formData, reportsTo: e.currentTarget.value });
            }}
          >
            <option className="text-red-100" value="CEO">
              CEO
            </option>
            {groups.data?.map((group) => (
              <option key={group.id}>{group.name}</option>
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
