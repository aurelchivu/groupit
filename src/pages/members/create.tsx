import { type NextPage } from "next";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const CreateGroup: NextPage = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });
  const router = useRouter();
  const createGroup = trpc.members.create.useMutation();

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await createGroup.mutateAsync(formData);
    router.push("/members");
  };

  return (
    <div className="px-40">
      <div className="py-4">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>

      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <h1 className="text-xl">Create New Member</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Member First Name" />
          </div>
          <TextInput
            id="base"
            type="text"
            placeholder="Members First Name"
            required={true}
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Member Last Name" />
          </div>
          <TextInput
            id="base"
            type="text"
            placeholder="Members Last Name"
            required={true}
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
            }}
          />
        </div>
        {/* <div>
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
            {members.data?.map((group) => (
              <option key={group.id}>{group.name}</option>
            ))}
          </select>
        </div> */}
        <Button type="submit" size="lg" color="success">
          Create Member
        </Button>
      </form>
    </div>
  );
};

export default CreateGroup;
