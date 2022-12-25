import { type NextPage } from "next";
import { Table, Checkbox, Button } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import { useState } from "react";

const GroupMembers: NextPage = () => {
  const router = useRouter();
  const { groupId } = router.query;

  const group = trpc.groups.getById.useQuery(groupId as string);
  const groupName = group?.data?.name;
  const addMembers = trpc.groups.addMember.useMutation();
  const members = trpc.members.getAll.useQuery();
  // const members = trpc.members.getAll.useQuery();

  // console.log("Members", members);
  const [checked, setChecked] = useState<boolean[]>(
    new Array(members.data?.length).fill(false)
  );

  console.log("Checked", checked);

  const handleOnChange = (position: number) => {
    const updatedChecked = checked.map((item, index) =>
      index === position ? !item : item
    );
    setChecked(updatedChecked);
    // console.log("Updated Checked", updatedChecked);
  };

  const addSelectedMembers = async () => {
    const selectedMembers = checked
      .map((item, index) => {
        if (item) {
          return members.data?.[index];
        }
      })
      .filter((item) => item);

    await addMembers.mutateAsync({
      groupId: router.query.groupId as string,
      membersToAdd: selectedMembers.map((item) => item?.id) as string[],
    });
    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="p-2 text-xl">{groupName} Members</h1>
        <div className="py-4">
          <Button size="lg" onClick={addSelectedMembers}>
            Add Selected Members
          </Button>
        </div>
      </div>
      {members.data ? (
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
            {members.data?.map((member, index) => (
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
                    href={`/members/edit/${member.id}`}
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

export default GroupMembers;
