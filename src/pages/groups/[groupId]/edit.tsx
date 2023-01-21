import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import InfoModal from "@/components/InfoModal";

interface IGroup {
  name: string;
  description: string;
  leaderId: string;
}

const EditGroup: NextPage = () => {
  const [id, setId] = useState<string>("");
  const [formData, setFormData] = useState<IGroup>({
    name: "",
    description: "",
    leaderId: "",
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
  const groupLeaderId = group?.leaderId;

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
        leaderId: groupLeaderId as string,
      });
    }
  }, [groupId, groupName, groupDescription, groupLeaderId]);

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateGroup.mutateAsync({ id: groupId as string, ...formData });
  };

  return (
    <div className="px-40 py-4 ">
      <div className="align-center flex justify-between">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
        {/* {group?.members.length === 0 ? (
          <Button
            color="success"
            onClick={() => router.push(`/groups/${group?.id}/add-members`)}
          >
            Add Members
          </Button>
        ) : group?.leader ? (
          <Button
            color="success"
            onClick={() => router.push(`/groups/${group?.id}/change-leader`)}
          >
            Change Leader
          </Button>
        ) : (
          <Button
            color="success"
            onClick={() => router.push(`/groups/${group?.id}/set-leader`)}
          >
            Set Leader
          </Button>
        )} */}
      </div>

      {error && (
        <InfoModal
          message={error.message}
          openModal={isErrorModalOpen}
          setOpenModal={setIsErrorModalOpen}
        />
      )}

      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <h1 className="text-xl">Edit Group {groupName}</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Group name" />
          </div>
          <TextInput
            id="name"
            type="text"
            required={true}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Group Description" />
          </div>
          <textarea
            id="description"
            rows={3}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => {
              setFormData({
                ...formData,
                description: e.target.value,
              });
            }}
          ></textarea>
        </div>

        <Button type="submit" size="lg">
          Save
        </Button>
      </form>
    </div>
  );
};

export default EditGroup;
