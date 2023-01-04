import { type NextPage } from "next";
import { Table, Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";

const Groups: NextPage = () => {
  const router = useRouter();
  const { status, data: groups, error } = trpc.groups.getAll.useQuery();
  console.log(groups);

  return status === "loading" ? (
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
    <>
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
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Leader</Table.HeadCell>
            <Table.HeadCell>Created by</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Updated at</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {groups?.map((group, index) => (
              <Table.Row
                className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                key={group.id}
              >
                <Table.Cell className="!p-4">{index + 1}</Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 hover:scale-105 dark:text-white">
                  <Link
                    href={`/groups/${group.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {group.name}
                  </Link>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 hover:scale-105 dark:text-white">
                  {group.id}
                </Table.Cell>

                <Table.Cell>
                  {group.leader ? (
                    <Link
                      href={`/groups/${group?.id}/group-members/${group.leaderId}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {group.leader?.fullName}
                    </Link>
                  ) : (
                    "NOT SET YET"
                  )}
                </Table.Cell>
                <Table.Cell>{group.createdBy.name}</Table.Cell>
                <Table.Cell>{group.createdAt.toLocaleString()}</Table.Cell>
                <Table.Cell>{group.updatedAt.toLocaleString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default Groups;
