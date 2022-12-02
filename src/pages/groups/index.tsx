import { type NextPage } from "next";
import { Table, Checkbox, Button } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";

const Groups: NextPage = () => {
  const router = useRouter();

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

      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="!p-4"></Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Reports TO</Table.HeadCell>
          <Table.HeadCell>Created at</Table.HeadCell>
          <Table.HeadCell>Updated at</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="!p-4">
              <Checkbox />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Management
            </Table.Cell>

            <Table.Cell>CEO</Table.Cell>
            <Table.Cell>{Date.now().toString()}</Table.Cell>
            <Table.Cell>{Date.now().toString()}</Table.Cell>
            <Link
              href="/groups"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              <Table.Cell>Edit</Table.Cell>
            </Link>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};

export default Groups;
