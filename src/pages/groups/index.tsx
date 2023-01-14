import { type NextPage } from "next";
import { Button, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";
import { useEffect, useState } from "react";
import type { Group } from "@/types/prismaTypes";
import DataTable from "@/components/DataTable";

const Groups: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);

  const router = useRouter();
  const { status, data, error } = trpc.groups.getAll.useQuery();
  const groups = data as Group[] | undefined;
  console.log(groups);

  useEffect(() => {
    if (groups) {
      setFilteredGroups(groups as Group[]);
    }
    const onSearch = (searchTerm: string) => {
      if (searchTerm === "") {
        setFilteredGroups(groups as Group[]);
      } else {
        const filtered = groups?.filter((group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGroups(filtered as Group[]);
      }
    };
    onSearch(searchTerm);
  }, [groups, searchTerm]);

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
        <h1 className="p-2 text-xl">Groups</h1>
        <div className="flex items-center justify-between">
          <div className="py-4">
            <TextInput
              id="search"
              type="text"
              placeholder="Search for a group"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="py-4">
            <Button size="lg" onClick={() => router.push("/groups/create")}>
              Create New Group
            </Button>
          </div>
        </div>
        <DataTable groups={filteredGroups} />
      </div>
    </>
  );
};

export default Groups;
