import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Table, Checkbox, Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";

const GroupMembers: NextPage = () => {
  const [id, setId] = useState<string>("");

  const router = useRouter();
  const { groupId } = router.query;

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId);
    }
  }, [groupId]);

  const {
    status,
    data: group,
    error,
  } = trpc.groups.getById.useQuery(id);
  console.log("Group", group);
  const groupName = group?.name;

  const removeMembers = trpc.groups.removeMember.useMutation();
  const members = group?.members;
  console.log("Members", members);

  const leader = members?.find((member) => member?.isLeader);
  console.log("Leader", leader);

  const membersToDisplay = group?.members.filter((member) => !member?.isLeader);

  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  console.log("Checked", checked);

  const handleOnChange = useCallback((memberId: string) => {
    setChecked((prevState) => ({
      ...prevState,
      [memberId]: !prevState[memberId],
    }));
  }, []);

  const removeSelectedMembers = async () => {
    const selectedMembers = Object.entries(checked)
      .filter(([_, isChecked]) => isChecked)
      .map(([memberId, _]) =>
        members?.find((member) => member.id === memberId)
      );
    console.log("Selected Members", selectedMembers);

    await removeMembers.mutateAsync({
      groupId: groupId as string,
      membersToRemove: selectedMembers.map((member) => member?.id) as string[],
    });
    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="p-4">
      <h1 className="p-2 text-xl">{groupName} Members</h1>
      <div className="py-4">
        <Button size="lg" onClick={() => router.push(`/groups/${groupId}`)}>
          Go Back To {groupName}
        </Button>
      </div>
      {members ? (
        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="!p-4"></Table.HeadCell>
              <Table.HeadCell className="!p-4"></Table.HeadCell>
              <Table.HeadCell>Full Name</Table.HeadCell>
              <Table.HeadCell>Member Id</Table.HeadCell>
              <Table.HeadCell>Added To Group</Table.HeadCell>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Updated at</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {leader && (
                <Table.Row
                  className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                  key={leader?.id}
                >
                  <Table.Cell className="!p-4">1</Table.Cell>
                  <Table.Cell className="!p-4">
                    <Checkbox
                      checked={checked[leader?.id as string]}
                      onChange={() => handleOnChange(leader?.id as string)}
                    />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link
                      href={`/groups/${groupId}/group-leader`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {leader?.member?.fullName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{leader?.id}</Table.Cell>
                  <Table.Cell>{leader?.createdAt.toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    {leader?.member?.createdAt.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {leader?.member?.updatedAt.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>LEADER</Table.Cell>
                </Table.Row>
              )}
              {membersToDisplay?.map((member, index) => (
                <Table.Row
                  className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                  key={member.id}
                >
                  <Table.Cell className="!p-4">
                    {leader ? index + 2 : index + 1}
                  </Table.Cell>
                  <Table.Cell className="!p-4">
                    <Checkbox
                      checked={checked[member.id]}
                      onChange={() => handleOnChange(member.id)}
                    />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link
                      href={`/groups/${groupId}/group-members/${member.memberId}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {member.member?.fullName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{member.id}</Table.Cell>
                  <Table.Cell>{member.createdAt.toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    {member.member?.createdAt.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {member.member?.updatedAt.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{member.isLeader ? "LEADER" : null}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div className="flex items-center justify-between">
            <div className="py-4">
              <Button size="lg" color="failure" onClick={removeSelectedMembers}>
                Remove Selected Members
              </Button>
            </div>
            <div className="py-4">
              <Button
                size="lg"
                color="success"
                onClick={() => router.push(`/groups/${groupId}/add-members`)}
              >
                Add New Members
              </Button>
            </div>
          </div>
        </>
      ) : status === "loading" ? (
        <span className="flex h-screen items-center justify-center">
          <Spinner
            color="failure"
            aria-label="Extra large spinner example"
            size="xl"
          />
        </span>
      ) : status === "error" ? (
        <ErrorModal errorMessage={error.message} />
      ) : (
        <div className="flex items-center justify-center">
          <h1 className="text-2xl">No Members Found</h1>
        </div>
      )}
    </div>
  );
};

export default GroupMembers;
