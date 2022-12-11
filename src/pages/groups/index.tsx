import { type NextPage } from "next";
import { Table, Checkbox, Button } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Groups: NextPage = () => {
  const router = useRouter();
  const groups = trpc.groups.getAll.useQuery();
  console.log(groups);
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="p-2 text-xl">Groups</h1>
        <div className="py-4">
          <Button size="lg" onClick={() => router.push("/groups/create")}>
            Create New Group
          </Button>
        </div>
      </div>
      {groups.data ? (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Leader</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Updated at</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Show Members</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {groups.data?.map((group) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={group.id}
              >
                <Table.Cell className="!p-4">
                  <Checkbox />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Link
                    href={`/groups/${group.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {group.name}{" "}
                  </Link>
                </Table.Cell>

                <Table.Cell>{group.leaderId || ""}</Table.Cell>
                <Table.Cell>{group.createdAt.toLocaleString()}</Table.Cell>
                <Table.Cell>{group.updatedAt.toLocaleString()}</Table.Cell>
                <Table.Cell>
                  <Link
                    href={`/groups/${group.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Show Members
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    href={`/groups/edit/${group.id}`}
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

export default Groups;
