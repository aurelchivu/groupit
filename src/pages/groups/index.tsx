import { type NextPage } from "next";
import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import { useEffect, useState } from "react";
import type { Group } from "@/types/prismaTypes";
import DataTable from "@/components/DataTable";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const Groups: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [showOnlyMyGroups, setShowOnlyMyGroups] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );

  const { data: session } = useSession();

  const router = useRouter();

  const { status, data, error } = trpc.groups.getAll.useQuery();
  const groups = data as Group[] | undefined;
  console.log(groups);

  useEffect(() => {
    const onSearch = (searchTerm: string) => {
      let filtered: Group[] | undefined;
      if (searchTerm === "" && !showOnlyMyGroups) {
        setFilteredGroups(groups as Group[]);
      } else if (searchTerm === "" && showOnlyMyGroups) {
        setFilteredGroups(
          groups?.filter(
            (group) => group.createdById === session?.user?.id
          ) as Group[]
        );
      } else if (searchTerm !== "" && !showOnlyMyGroups) {
        filtered = groups?.filter((group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGroups(filtered as Group[]);
      } else if (searchTerm !== "" && showOnlyMyGroups) {
        filtered = groups
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
    <InfoModal
      message={error.message}
      openModal={isErrorModalOpen}
      setOpenModal={setIsErrorModalOpen}
    />
  ) : (
    <>
      <div className="p-4">
        <motion.h1
          className="p-2 text-2xl"
          initial={{ translateX: 1500 }}
          animate={{ translateX: 0 }}
          transition={{ duration: 0.8 }}
        >
          Groups
        </motion.h1>

        <div className="flex items-center justify-between">
          <motion.div
            className="py-4"
            initial={{ translateX: -500 }}
            animate={{ translateX: 0 }}
            transition={{ duration: 1 }}
          >
            <TextInput
              id="search"
              type="text"
              placeholder="Search for a group"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ translateY: -500 }}
            animate={{ translateY: 0 }}
            transition={{ duration: 1 }}
          >
            <Checkbox
              id="checked"
              checked={showOnlyMyGroups}
              onChange={handleCheckboxChange}
            />
            <Label htmlFor="checked">
              <span className="text-lg">Show Only My Groups</span>
            </Label>
          </motion.div>
          <motion.div
            className="py-4"
            initial={{ translateX: 500 }}
            animate={{ translateX: 0 }}
            transition={{ duration: 1 }}
          >
            <Button size="lg" onClick={() => router.push("/groups/create")}>
              Create New Group
            </Button>
          </motion.div>
        </div>
        <DataTable groups={filteredGroups} />
      </div>
    </>
  );
};

export default Groups;
