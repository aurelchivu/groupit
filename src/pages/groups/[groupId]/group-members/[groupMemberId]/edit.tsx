import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, Modal, TextInput, Toast } from "flowbite-react";
import { useRouter } from "next/router";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { trpc } from "../../../../../utils/trpc";

const EditGroupMember: NextPage = () => {
  const router = useRouter();

  interface IState {
    fullName: string;
    details: string;
  }

  const [formData, setFormData] = useState<IState>({
    fullName: "",
    details: "",
  });

  const [id, setMemberId] = useState<string>("");

  const { memberId } = router.query;
  const member = trpc.members.getById.useQuery(id as string);

  const memberFullName = member?.data?.fullName as string;
  const memberDetails = member?.data?.details as string;

  const deleteMember = trpc.members.delete.useMutation();
  const updateMember = trpc.members.update.useMutation();

  const [openModal, setOpenModal] = useState<string | undefined>();

  useEffect(() => {
    if (typeof memberId === "string") {
      setMemberId(memberId);
      setFormData({ fullName: memberFullName, details: memberDetails });
    }
  }, [memberId, memberFullName, memberDetails]);

  const submitCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateMember.mutateAsync({ id: memberId as string, ...formData });
    router.push("/members");
  };

  const handleDelete = async () => {
    await deleteMember.mutateAsync(id as string);
    setOpenModal(undefined);
    router.push("/members");
  };

  return (
    <div className="px-40 py-4">
      <div className="align-center flex justify-between">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
        <>
          <Button color="warning" onClick={() => setOpenModal("default")}>
            Remove From Group
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
                  Are you sure you want to delete member {memberFullName}?
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
        <h1 className="text-xl">Edit Member: {memberFullName}</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="firstName" value="Member Full Name" />
          </div>
          <TextInput
            id="memberFullName"
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
            <Label htmlFor="base" value="Member Details" />
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
          Edit Member
        </Button>
      </form>
    </div>
  );
};

export default EditGroupMember;
