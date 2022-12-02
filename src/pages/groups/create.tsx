import { type NextPage } from "next";
import {
  Table,
  Checkbox,
  Button,
  Label,
  TextInput,
  Dropdown,
} from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";

const CreateGroup: NextPage = () => {
  const router = useRouter();
  const createGroupHandler = async () => {
    console.log("Group Created");
  };
  return (
    <>
      <div className="py-4 px-2">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>

      <form className="flex flex-col gap-5 p-40">
        <h1 className="text-xl">Create New Group</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Group Name" />
          </div>
          <TextInput
            id="base"
            type="text"
            placeholder="Group Name"
            required={true}
          />
        </div>
        <div>
          <Dropdown label="Reports To" dismissOnClick={false} color="light">
            <Dropdown.Item>CEO</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
        <Button
          type="submit"
          size="lg"
          color="success"
          onClick={createGroupHandler}
        >
          Create Group
        </Button>
      </form>
    </>
  );
};

export default CreateGroup;
