import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Table, Checkbox, Button } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";

const AddMembers: NextPage = () => {
  const [id, setId] = useState<string>("");

  const router = useRouter();
  const { groupId } = router.query;

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId as string);
    }
  }, [groupId]);

  const {data: group} = trpc.groups.getById.useQuery(id);
  const groupMembers = group?.members;
  // console.log("Group Members", groupMembers);

  const allMembers = trpc.members.getAll.useQuery();
  const addMembers = trpc.groups.addMember.useMutation();
  const { error } = addMembers;
  // console.log("All Members", allMembers.data);

  const filteredMembers = allMembers.data?.filter(
    (member) =>
      !groupMembers?.some((groupMember) => groupMember.member?.id === member.id)
  );
  // console.log("Filtered Members", filteredMembers);

  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  console.log("Checked", checked);

  const handleOnChange = useCallback((memberId: string) => {
    setChecked((prevState) => ({
      ...prevState,
      [memberId]: !prevState[memberId],
    }));
  }, []);

  const addSelectedMembers = async () => {
    const selectedMembers = Object.entries(checked)
      .filter(([_, isChecked]) => isChecked)
      .map(([memberId, _]) =>
        filteredMembers?.find((member) => member.id === memberId)
      );
    console.log("Selected Members", selectedMembers);

    await addMembers.mutateAsync({
      groupId: groupId as string,
      membersToAdd: selectedMembers.map((item) => item?.id) as string[],
    });
    router.push(`/groups/${groupId}/group-members`);
  };

  return (
    <div className="p-4">
      <h1 className="p-2 text-xl">Add Members</h1>
      <div className="flex items-center justify-between">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
        <div className="py-4">
          <Button size="lg" color="success" onClick={addSelectedMembers}>
            Add Selected Members
          </Button>
        </div>
      </div>
      {error && <ErrorModal errorMessage={error.message} />}
      {filteredMembers ? (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell>Full Name</Table.HeadCell>
            <Table.HeadCell>Created by</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Updated at</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredMembers?.map((member) => (
              <Table.Row
                className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                key={member.id}
              >
                <Table.Cell className="!p-4">
                  <Checkbox
                    checked={checked[member.id]}
                    onChange={() => handleOnChange(member.id)}
                  />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Link
                    href={`/members/${member.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {member.fullName}{" "}
                  </Link>
                </Table.Cell>
                <Table.Cell>{member.createdBy.name}</Table.Cell>
                <Table.Cell>{member.createdAt.toLocaleString()}</Table.Cell>
                <Table.Cell>{member.updatedAt.toLocaleString()}</Table.Cell>
                <Table.Cell>
                  <Link
                    href={`/members/${member.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Details
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    href={`/members/${member.id}/edit`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AddMembers;
