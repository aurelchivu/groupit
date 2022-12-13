import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, Modal, TextInput, Toast } from "flowbite-react";
import { useRouter } from "next/router";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { trpc } from "../../../utils/trpc";

const EditGroup: NextPage = () => {
  const router = useRouter();

  interface GroupState {
    name: string;
    leaderId: string;
  }

  const [formData, setFormData] = useState<GroupState>({
    name: "",
    leaderId: "",
  });

  const [groupId, setGroupId] = useState("");

  const { id } = router.query;
  const group = trpc.groups.getById.useQuery(groupId as string);
  console.log(group);

  const groupName = group?.data?.name as string;
  const groupLeaderId = group?.data?.leaderId as string;

  const deleteGroup = trpc.groups.delete.useMutation();
  const updateGroup = trpc.groups.update.useMutation();

  const [openModal, setOpenModal] = useState<string | undefined>();

  useEffect(() => {
    if (id) {
      setGroupId(id as string);
      setFormData({ name: groupName, leaderId: groupLeaderId });
    }
  }, [id, groupName, groupLeaderId]);

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateGroup.mutateAsync({ id: groupId as string, ...formData });
    router.push("/groups");
  };

  const handleDelete = async () => {
    await deleteGroup.mutateAsync(id as string);
    setOpenModal(undefined);
    router.push("/groups");
  };

  return (
    <div className="px-40 py-4">
      <div className="align-center flex justify-between">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
        <>
          <Button color="warning" onClick={() => setOpenModal("default")}>
            Delete Group
          </Button>
          <Modal
            show={openModal === "default"}
            onClose={() => setOpenModal(undefined)}
          >
            <Modal.Header>Delete Confirmation</Modal.Header>
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this group {groupName}?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="success" onClick={handleDelete}>
                    OK, do it!
                  </Button>
                  <Button
                    color="failure"
                    onClick={() => setOpenModal(undefined)}
                  >
                    NO, get me out of here!
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      </div>
      <form className="flex flex-col gap-5 py-40" onSubmit={submitCreate}>
        <h1 className="text-xl">Edit Group: {groupName}</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Group name" />
          </div>
          <TextInput
            id="groupName"
            type="text"
            required={true}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
        </div>

        <Button type="submit" size="lg">
          Edit Group
        </Button>
      </form>
    </div>
  );
};

export default EditGroup;
