import { type NextPage } from "next";
import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";
import { useEffect, useState } from "react";
import type { Group } from "@/types/prismaTypes";
import DataTable from "@/components/DataTable";
import { useSession } from "next-auth/react";

const Groups: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [showOnlyMyGroups, setShowOnlyMyGroups] = useState<boolean>(false);

  const { data: session } = useSession();

  const router = useRouter();

  const { status, data, error } = trpc.groups.getAll.useQuery();
  const groups = data as Group[] | undefined;
  console.log(groups);

  useEffect(() => {
    const onSearch = (searchTerm: string) => {
      if (searchTerm === "" && !showOnlyMyGroups) {
        setFilteredGroups(groups as Group[]);
      } else if (searchTerm === "" && showOnlyMyGroups) {
        setFilteredGroups(
          groups?.filter(
            (group) => group.createdById === session?.user?.id
          ) as Group[]
        );
      } else if (searchTerm !== "" && !showOnlyMyGroups) {
        const filtered = groups?.filter((group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGroups(filtered as Group[]);
      } else if (searchTerm !== "" && showOnlyMyGroups) {
        const filtered = groups
          ?.filter((group) => group.createdById === session?.user?.id)
          ?.filter((group) =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        setFilteredGroups(filtered as Group[]);
      }
    };
    onSearch(searchTerm);
  }, [groups, searchTerm, session?.user?.id, showOnlyMyGroups]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowOnlyMyGroups(!showOnlyMyGroups);
    if (event.target.checked) {
      setFilteredGroups(
        groups?.filter(
          (group) => group.createdById === session?.user?.id
        ) as Group[]
      );
    } else {
      setFilteredGroups(groups as Group[]);
    }
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
        <h1 className="p-2 text-2xl">Groups</h1>

        <div className="flex items-center justify-between">
          <div className="py-4">
            <TextInput
              id="search"
              type="text"
              placeholder="Search for a group"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center gap-2 ">
            <Checkbox
              id="checked"
              checked={showOnlyMyGroups}
              onChange={handleCheckboxChange}
            />
            <Label htmlFor="checked">
              <span className="text-lg">Show Only My Groups</span>
            </Label>
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
