import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, Modal, TextInput, Toast } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";

const EditGroupLeader: NextPage = () => {
  const router = useRouter();
  const { groupId } = router.query;

  interface IFormData {
    fullName: string;
    details: string;
  }

  const [formData, setFormData] = useState<IFormData>({
    fullName: "",
    details: "",
  });

  interface IState {
    groupId: string;
  }

  const [ids, setIds] = useState<IState>({
    groupId: "",
  });

  const { data: group } = trpc.groups.getById.useQuery(ids.groupId);
  console.log("Group=", group);
  const leader = group?.members?.find(
    (member) => member?.member?.id === group.leaderId
  );
  console.log("Leader=", leader);

  const leaderFullName = leader?.member?.fullName as string;
  const leaderDetails = leader?.member?.details as string;

  const updateMember = trpc.members.update.useMutation();
  const { error } = updateMember;

  useEffect(() => {
    if (typeof groupId === "string") {
      setIds({ groupId: groupId as string });
      setFormData({ fullName: leaderFullName, details: leaderDetails });
    }
  }, [groupId, leaderFullName, leaderDetails]);

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateMember.mutateAsync({
      id: leader?.member?.id as string,
      ...formData,
    });
    router.push(`/groups/${groupId}/`);
  };

  return (
    <div className="px-40 py-4">
      {error && <ErrorModal errorMessage={error.message} />}
      <div className="align-center flex justify-between">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button
          color="success"
          onClick={() => router.push(`/groups/${group?.id}/change-leader`)}
        >
          Change Leader
        </Button>
      </div>

      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <h1 className="text-xl">{`Edit ${group?.name}'s Leader ${leaderFullName}`}</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="fullName" value="Leader Full Name" />
          </div>
          <TextInput
            id="fullName"
            type="text"
            required={true}
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="base" value="Leader Details" />
          </div>
          <textarea
            id="details"
            rows={3}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={formData.details}
            onChange={(e) => {
              setFormData({
                ...formData,
                details: e.target.value,
              });
            }}
          ></textarea>
        </div>
        <Button type="submit" size="lg">
          Edit Leader
        </Button>
      </form>
    </div>
  );
};

export default EditGroupLeader;
