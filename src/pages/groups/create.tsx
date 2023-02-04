import { type NextPage } from "next";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import { motion } from "framer-motion";

interface IGroup {
  groupName: string;
  description?: string;
  leader: string | undefined;
  leaderId?: string | undefined;
}

const CreateGroup: NextPage = () => {
  const [formData, setFormData] = useState<IGroup>({
    groupName: "",
    description: "",
    leader: "",
    leaderId: "",
  });
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );

  const router = useRouter();
  const members = trpc.members.getAll.useQuery();

  const createGroup = trpc.groups.create.useMutation({
    onSuccess: (data) => {
      router.push(`/groups/${data?.id}`);
    },
  });

  const { error } = createGroup;

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await createGroup.mutateAsync({
      name: formData.groupName,
      description: formData.description,
      leaderId: formData.leaderId || undefined,
    });
  };

  return (
    <div className="px-40">
      <motion.div
        className="py-4"
        initial={{ translateX: -500 }}
        animate={{ translateX: 0 }}
        transition={{ duration: 1 }}
      >
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </motion.div>
      {error && (
        <InfoModal
          message={error.message}
          openModal={isErrorModalOpen}
          setOpenModal={setIsErrorModalOpen}
        />
      )}
      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <motion.h1
          className="text-xl"
          initial={{ translateX: 1500 }}
          animate={{ translateX: 0 }}
          transition={{ duration: 0.8 }}
        >
          Create New Group
        </motion.h1>
        <motion.div
          initial={{ rotate: 180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-2 block">
            <Label htmlFor="base" value="Name" />
          </div>
          <TextInput
            id="base"
            type="text"
            placeholder="Name"
            required={true}
            value={formData.groupName}
            onChange={(e) => {
              setFormData({ ...formData, groupName: e.target.value });
            }}
          />
        </motion.div>
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-2 block">
            <Label htmlFor="base" value="Description" />
          </div>
          <textarea
            id="message"
            rows={3}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Description..."
            value={formData.description}
            onChange={(e) => {
              setFormData({
                ...formData,
                description: e.target.value,
              });
            }}
          ></textarea>
        </motion.div>
        <motion.div
          initial={{ translateX: -500 }}
          animate={{ translateX: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-2 block">
            <Label htmlFor="base" value="Please Select a Leader" />
          </div>
          <select
            className="rounded-md"
            value={formData.leader}
            color="light"
            onChange={(e) => {
              setFormData({
                ...formData,
                leader: members.data?.find(
                  (member) => member.fullName === e.currentTarget.value
                )?.fullName,
                leaderId: members.data?.find(
                  (member) => member.fullName === e.currentTarget.value
                )?.id,
              });
            }}
          >
            <option>Select Leader</option>
            {members.data?.map((member) => (
              <option key={member.id}>{member.fullName}</option>
            ))}
          </select>
        </motion.div>
        <motion.div
          initial={{ translateY: 2000 }}
          animate={{ translateY: 0 }}
          transition={{ duration: 1 }}
        >
          <Button type="submit" size="lg" color="success">
            Create Group
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default CreateGroup;
