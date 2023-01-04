import { type NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Table, Checkbox, Button, Spinner, Modal } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import ErrorModal from "@/components/ErrorModal";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const GroupMembers: NextPage = () => {
  const [id, setId] = useState<string>("");
  const [openModal, setOpenModal] = useState<string | undefined>();

  const router = useRouter();
  const { groupId } = router.query;

  useEffect(() => {
    if (typeof groupId === "string") {
      setId(groupId);
    }
  }, [groupId]);

  const { status, data: group, error } = trpc.groups.getById.useQuery(id);
  console.log("Group", group);
  const groupName = group?.name;

  const removeMembers = trpc.groups.removeMember.useMutation({
    onSuccess: () => {
      router.push(`/groups/${groupId}`);
    },
  });

  const members = group?.members;
  console.log("Members", members);

  const leader = members?.find((member) => member?.isLeader);
  console.log("Leader", leader);

  const membersToDisplay = group?.members.filter((member) => !member?.isLeader);

  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  console.log("Checked", checked);

  const handleOnChange = useCallback((memberId: string) => {
    setChecked((prevState) => ({
      ...prevState,
      [memberId]: !prevState[memberId],
    }));
  }, []);

  const removeSelectedMembers = async () => {
    const selectedMembers = Object.entries(checked)
      .filter(([_, isChecked]) => isChecked)
      .map(([memberId, _]) =>
        members?.find((member) => member.id === memberId)
      );
    console.log("Selected Members", selectedMembers);

    await removeMembers.mutateAsync({
      groupId: groupId as string,
      membersToRemove: selectedMembers.map((member) => member?.id) as string[],
    });
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
    <ErrorModal errorMessage={error.message} />
  ) : (
    <>
      <div className="p-4">
        <div className="py-4">
          <Button size="lg" onClick={() => router.push(`/groups/${groupId}`)}>
            Go Back To {groupName}
          </Button>
        </div>
        <h1 className="p-2 text-xl">{`${groupName}'s Members`}</h1>

        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="!p-4"></Table.HeadCell>
              <Table.HeadCell className="!p-4"></Table.HeadCell>
              <Table.HeadCell>Full Name</Table.HeadCell>
              <Table.HeadCell>Member Id</Table.HeadCell>
              <Table.HeadCell>Added To Group</Table.HeadCell>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Updated at</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {leader && (
                <Table.Row
                  className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                  key={leader?.id}
                >
                  <Table.Cell className="!p-4">1</Table.Cell>
                  <Table.Cell className="!p-4">
                    <Checkbox
                      checked={checked[leader?.id as string]}
                      onChange={() => handleOnChange(leader?.id as string)}
                    />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link
                      href={`/groups/${groupId}/group-leader`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {leader?.member?.fullName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{leader?.id}</Table.Cell>
                  <Table.Cell>{leader?.createdAt.toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    {leader?.member?.createdAt.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {leader?.member?.updatedAt.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>LEADER</Table.Cell>
                </Table.Row>
              )}
              {membersToDisplay?.map((member, index) => (
                <Table.Row
                  className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                  key={member.id}
                >
                  <Table.Cell className="!p-4">
                    {leader ? index + 2 : index + 1}
                  </Table.Cell>
                  <Table.Cell className="!p-4">
                    <Checkbox
                      checked={checked[member.id]}
                      onChange={() => handleOnChange(member.id)}
                    />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link
                      href={`/groups/${groupId}/group-members/${member.memberId}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {member.member?.fullName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{member.id}</Table.Cell>
                  <Table.Cell>{member.createdAt.toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    {member.member?.createdAt.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {member.member?.updatedAt.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{member.isLeader ? "LEADER" : null}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div className="flex items-center justify-between">
            <div className="py-4">
              <Button
                size="lg"
                color="success"
                onClick={() => router.push(`/groups/${groupId}/add-members`)}
              >
                Add New Members
              </Button>
            </div>

            <div className="py-4">
              <Button
                size="lg"
                color="failure"
                disabled={
                  Object.entries(checked)
                    .filter(([_, isChecked]) => isChecked)
                    .map(([memberId, _]) =>
                      members?.find((member) => member.id === memberId)
                    ).length === 0
                }
                onClick={() => setOpenModal("default")}
              >
                Remove Selected Members
              </Button>
            </div>
          </div>
        </>
      </div>
      <Modal
        show={openModal === "default"}
        onClose={() => setOpenModal(undefined)}
      >
        <Modal.Header>Delete Confirmation</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to remove the selected member(s)?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={removeSelectedMembers}>
                OK, do it!
              </Button>
              <Button color="failure" onClick={() => setOpenModal(undefined)}>
                NO, get me out of here!
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GroupMembers;
