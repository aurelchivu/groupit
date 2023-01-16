import { type NextPage } from "next";
import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import { useEffect, useState } from "react";
import type { Member } from "@/types/prismaTypes";
import DataTable from "@/components/DataTable";
import { useSession } from "next-auth/react";

const Members: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [showOnlyMyMembers, setShowOnlyMyMembers] = useState<boolean>(false);

  const { data: session } = useSession();

  const router = useRouter();

  const { status, data, error } = trpc.members.getAll.useQuery();
  const members = data as Member[] | undefined;
  console.log("Members:", members);

  useEffect(() => {
    const onSearch = (searchTerm: string) => {
      let filtered: Member[] | undefined;
      if (searchTerm === "" && !showOnlyMyMembers) {
        setFilteredMembers(members as Member[]);
      } else if (searchTerm === "" && showOnlyMyMembers) {
        setFilteredMembers(
          members?.filter(
            (group) => group.createdById === session?.user?.id
          ) as Member[]
        );
      } else if (searchTerm !== "" && !showOnlyMyMembers) {
        filtered = members?.filter((group) =>
          group.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filtered as Member[]);
      } else if (searchTerm !== "" && showOnlyMyMembers) {
        filtered = members
          ?.filter((group) => group.createdById === session?.user?.id)
          ?.filter((group) =>
            group.fullName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        setFilteredMembers(filtered as Member[]);
      }
    };
    onSearch(searchTerm);
  }, [members, searchTerm, session?.user?.id, showOnlyMyMembers]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowOnlyMyMembers(!showOnlyMyMembers);
    if (event.target.checked) {
      setFilteredMembers(
        members?.filter(
          (group) => group.createdById === session?.user?.id
        ) as Member[]
      );
    } else {
      setFilteredMembers(members as Member[]);
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
    <InfoModal message={error.message} />
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
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center gap-2 ">
            <Checkbox
              id="checked"
              checked={showOnlyMyMembers}
              onChange={handleCheckboxChange}
            />
            <Label htmlFor="checked">
              <span className="text-lg">Show Only My Members</span>
            </Label>
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
