import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, Modal, TextInput, Toast } from "flowbite-react";
import { useRouter } from "next/router";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { trpc } from "../../../utils/trpc";

const EditMember: NextPage = () => {
  const router = useRouter();

  interface MemberState {
    firstName: string;
    lastName: string;
  }

  const [formData, setFormData] = useState<MemberState>({
    firstName: "",
    lastName: "",
  });

  const [memberId, setMemberId] = useState("");

  const { id } = router.query;
  const member = trpc.members.getById.useQuery(memberId as string);

  const memberFirstName = member?.data?.firstName as string;
  const memberLastName = member?.data?.lastName as string;

  const deleteMember = trpc.members.delete.useMutation();
  const updateMember = trpc.members.update.useMutation();

  const [openModal, setOpenModal] = useState<string | undefined>();

  useEffect(() => {
    if (id) {
      setMemberId(id as string);
      setFormData({ firstName: memberFirstName, lastName: memberLastName });
    }
  }, [id, memberFirstName, memberLastName]);

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
        <Button size="lg" onClick={() => router.push("/members")}>
          Go Back
        </Button>
        <>
          <Button color="warning" onClick={() => setOpenModal("default")}>
            Delete Member
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
                  Are you sure you want to delete this member?
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
        <h1 className="text-xl">
          Edit Member: {memberFirstName} {memberLastName}
        </h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="firstName" value="Member First Name" />
          </div>
          <TextInput
            id="memberFirstName"
            type="text"
            placeholder="Member First name"
            required={true}
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="lastName" value="Member Last Name" />
          </div>
          <TextInput
            id="memberLastName"
            type="text"
            placeholder="Member Last name"
            required={true}
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
            }}
          />
        </div>
        {/* <div>
          <div className="mb-2 block">
            <Label htmlFor="boss" value="New Bo$$" />
          </div>
          <select
            className="rounded-md"
            value={formData.newBoss}
            color="light"
            onChange={(e) => {
              setFormData({ ...formData, newBoss: e.currentTarget.value });
            }}
          >
            <option className="text-red-100" value="CEO">
              CEO
            </option>
            {members.data?.map((member) => (
              <option key={member.id}>{member.firstName}</option>
            ))}
          </select>
        </div> */}

        <Button type="submit" size="lg">
          Edit Member
        </Button>
        {/* <Toast>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            Member edited successfully.
          </div>
          <Toast.Toggle />
        </Toast> */}
      </form>
    </div>
  );
};

export default EditMember;
