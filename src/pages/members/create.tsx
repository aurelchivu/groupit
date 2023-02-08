import { type NextPage } from "next";
import { useState, useEffect, useRef } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";
import { motion } from "framer-motion";

interface IState {
  fullName: string;
  details?: string;
}

const CreateMember: NextPage = () => {
  const [formData, setFormData] = useState<IState>({
    fullName: "",
    details: "",
  });
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<string | undefined>(
    "open"
  );

  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const createMember = trpc.members.create.useMutation({
    onSuccess: (data) => {
      router.push(`/members/${data?.id}`);
    },
  });

  const { error } = createMember;

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await createMember.mutateAsync({ ...formData });
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
          Go back
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
          Create new member
        </motion.h1>
        <motion.div
          initial={{ rotate: 180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-2 block">
            <Label htmlFor="base" value="Full name" />
          </div>
          <TextInput
            ref={inputRef}
            id="base"
            type="text"
            placeholder="Full name"
            required={true}
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
            }}
          />
        </motion.div>
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-2 block">
            <Label htmlFor="base" value="Details" />
          </div>
          <textarea
            id="message"
            rows={3}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Details..."
            value={formData.details}
            onChange={(e) => {
              setFormData({
                ...formData,
                details: e.target.value,
              });
            }}
          ></textarea>
        </motion.div>
        <motion.div
          className="flex justify-center"
          initial={{ translateY: 2000 }}
          animate={{ translateY: 0 }}
          transition={{ duration: 1 }}
        >
          <Button type="submit" size="lg" color="success">
            Create Member
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default CreateMember;
