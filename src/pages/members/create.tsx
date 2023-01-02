import { type NextPage } from "next";
import { useState, useEffect, useRef } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const CreateMember: NextPage = () => {
  interface MemberState {
    fullName: string;
    details?: string;
  }

  const router = useRouter();

  const [formData, setFormData] = useState<MemberState>({
    fullName: "",
    details: "",
  });

  const createMember = trpc.members.create.useMutation({
    onSuccess: (data) => {
      console.log("dataaa === ", data);
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await createMember.mutateAsync({ ...formData });
    router.push("/members");
  };

  return (
    <div className="px-40">
      <div className="py-4">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>

      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <h1 className="text-xl">Create New Member</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Member Full Name" />
          </div>
          <TextInput
            ref={inputRef}
            id="base"
            type="text"
            placeholder="Members Full Name"
            required={true}
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
            }}
          />
        </div>
        <div>
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
        </div>

        <Button type="submit" size="lg" color="success">
          Create Member
        </Button>
      </form>
    </div>
  );
};

export default CreateMember;
