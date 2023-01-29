import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import { motion } from "framer-motion";
import EditForm from "@/components/EditForm";

interface IGroup {
  name: string;
  description: string;
}

const EditGroup: NextPage = () => {
  const [id, setId] = useState<string>("");
  const [formData, setFormData] = useState<IGroup>({
    name: "",
    description: "",
  });
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );

  const router = useRouter();
  const { groupId } = router.query;

  const { data: group } = trpc.groups.getById.useQuery(id);
  console.log("Group", group);

  const groupName = group?.name;
  const groupDescription = group?.description;

  const updateGroup = trpc.groups.update.useMutation({
    onSuccess: (data) => {
      router.push(`/groups/${data?.id}`);
    },
  });

  const { error } = updateGroup;

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId);
      setFormData({
        name: groupName as string,
        description: groupDescription as string,
      });
    }
  }, [groupId, groupName, groupDescription]);

  const submitUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateGroup.mutateAsync({ id: groupId as string, ...formData });
  };

  return (
    <div className="px-40 py-4 ">
      {error && (
        <InfoModal
          message={error.message}
          openModal={isErrorModalOpen}
          setOpenModal={setIsErrorModalOpen}
        />
      )}
      {/* <motion.div
        className="align-center flex justify-between"
        initial={{ translateX: -500 }}
        animate={{ translateX: 0 }}
        transition={{ duration: 1 }}
      >
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </motion.div> */}
      <EditForm
        name={groupName}
        groupFormData={formData}
        setGroupFormData={setFormData}
        submitUpdate={submitUpdate}
      />
    </div>
  );
};

export default EditGroup;
