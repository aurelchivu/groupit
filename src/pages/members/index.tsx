import { type NextPage } from "next";
import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import { useEffect, useState } from "react";
import type { Member } from "@/types/prismaTypes";
import DataTable from "@/components/DataTable";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const Members: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [showOnlyMyMembers, setShowOnlyMyMembers] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );

  const { data: session } = useSession();

  const router = useRouter();

  const { status, data, error } = trpc.members.getAll.useQuery();
  const members = data as Member[] | undefined;
  // console.log("Members:", members);

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
          Members
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
              placeholder="Search for a member"
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
              checked={showOnlyMyMembers}
              onChange={handleCheckboxChange}
            />
            <Label htmlFor="checked">
              <span className="text-lg">Show only my members</span>
            </Label>
          </motion.div>
          <motion.div
            className="py-4"
            initial={{ translateX: 500 }}
            animate={{ translateX: 0 }}
            transition={{ duration: 1 }}
          >
            <Button size="lg" onClick={() => router.push("/members/create")}>
              Create new member
            </Button>
          </motion.div>
        </div>
        <DataTable members={filteredMembers} />
      </div>
    </>
  );
};

export default Members;
