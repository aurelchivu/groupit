import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Table, Checkbox, Button } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";

const GroupMembers: NextPage = () => {
  const [id, setId] = useState<string>("");

  const router = useRouter();
  const { groupId } = router.query;

  const group = trpc.groups.getById.useQuery(id as string);
  console.log("Group", group.data);
  const groupName = group?.data?.name;
  const removeMembers = trpc.groups.removeMember.useMutation();
  const members = group.data?.members;
  // const members = trpc.members.getAll.useQuery();

  // console.log("Members", members);
  const [checked, setChecked] = useState<boolean[]>(
    new Array(members?.length).fill(false)
  );
  console.log("Checked", checked);

  useEffect(() => {
    if (groupId) {
      setId(groupId as string);
    }
  }, [groupId]);

  const handleOnChange = (position: number) => {
    const updatedChecked = checked.map((item, index) =>
      index === position ? !item : item
    );
    setChecked(updatedChecked);
    // console.log("Updated Checked", updatedChecked);
  };

  const removeSelectedMembers = async () => {
    const selectedMembers = checked
      .map((item, index) => {
        if (item) {
          return members?.[index];
        }
      })
      .filter((item) => item);
    console.log("Selected Members", selectedMembers);

    await removeMembers.mutateAsync({
      groupId: groupId as string,
      membersToRemove: selectedMembers.map((item) => item?.id) as string[],
    });
    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="p-2 text-xl">{groupName} Members</h1>
        <div className="py-4">
          <Button size="lg" color="failure" onClick={removeSelectedMembers}>
            Remove Selected Members
          </Button>
        </div>
      </div>
      {members ? (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell>Full Name</Table.HeadCell>
            <Table.HeadCell>Added To Group</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Updated at</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {members?.map((member, index) => (
              <Table.Row
                className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                key={member.id}
              >
                <Table.Cell className="!p-4">
                  <Checkbox
                    checked={checked[index]}
                    onChange={() => handleOnChange(index)}
                  />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Link
                    href={`/members/${member.memberId}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {member.member?.fullName}{" "}
                  </Link>
                </Table.Cell>
                <Table.Cell>{member.createdAt.toLocaleString()}</Table.Cell>
                <Table.Cell>
                  {member.member?.createdAt.toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  {member.member?.updatedAt.toLocaleString()}
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

export default GroupMembers;
