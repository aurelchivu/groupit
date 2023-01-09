import { type NextPage } from "next";
import { Table, Button, Spinner, TextInput } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";
import { useEffect, useState } from "react";

interface Member {
  id: string;
  fullName: string;
  leaderOf: {
    id: string;
    name: string;
  }[];
  createdBy: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const Members: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

  const router = useRouter();
  const { status, data: members, error } = trpc.members.getAll.useQuery();
  console.log("Members:", members);

  useEffect(() => {
    if (members) {
      setFilteredMembers(members as Member[]);
    }
    const onSearch = (searchTerm: string) => {
      if (searchTerm === "") {
        setFilteredMembers(members as Member[]);
      } else {
        const filtered = members?.filter((member) =>
          member.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filtered as Member[]);
      }
    };
    onSearch(searchTerm);
  }, [members, searchTerm]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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
        <h1 className="p-2 text-xl">Members</h1>
        <div className="flex items-center justify-between">
          <div className="py-4">
            <TextInput
              id="search"
              type="text"
              placeholder="Search for a member"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="py-4">
            <Button size="lg" onClick={() => router.push("/members/create")}>
              Create New Member
            </Button>
          </div>
        </div>

        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell>Full Name</Table.HeadCell>
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Created by</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Updated at</Table.HeadCell>
            <Table.HeadCell>Leader</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredMembers?.map((member, index) => (
              <Table.Row
                className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                key={member.id}
              >
                <Table.Cell className="!p-4">{index + 1}</Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Link
                    href={`/members/${member.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {member.fullName}{" "}
                  </Link>
                </Table.Cell>
                <Table.Cell>{member.id}</Table.Cell>
                <Table.Cell>{member.createdBy.name}</Table.Cell>
                <Table.Cell>{member.createdAt.toLocaleString()}</Table.Cell>
                <Table.Cell>{member.updatedAt.toLocaleString()}</Table.Cell>
                <Table.Cell>
                  {member?.leaderOf?.length > 0 ? "Yes" : "No"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default Members;
