import { type NextPage } from "next";
import { Button, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";
import { useEffect, useState } from "react";
import type { Member } from "@/types/prismaTypes";
import DataTable from "@/components/DataTable";

const Members: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

  const router = useRouter();
  const { status, data, error } = trpc.members.getAll.useQuery();
  const members = data as Member[] | undefined;
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
        <DataTable members={filteredMembers} />
      </div>
    </>
  );
};

export default Members;
