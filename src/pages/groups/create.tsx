import { type NextPage } from "next";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const CreateGroup: NextPage = () => {
  interface GroupState {
    name: string;
    leader: string;
  }

  const router = useRouter();
  const members = trpc.members.getAll.useQuery();

  const [groupName, setGroupName] = useState<string>("");
  const [leader, setLeader] = useState<string>("");

  const createGroup = trpc.groups.create.useMutation();

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await createGroup.mutateAsync({ name: groupName });
    router.push("/groups");
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
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="leader" value="Leader" />
          </div>
          <select
            className="rounded-md"
            value="leader"
            color="light"
            onChange={(e) => {
              setLeader(e.currentTarget.value);
            }}
          >
            {members.data?.map((member) => (
              <option key={member.id}>
                {member.fullName}
              </option>
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
