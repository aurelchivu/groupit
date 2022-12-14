import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "flowbite-react";
import { trpc } from "@/utils/trpc";
import DeleteModal from "@/components/DeleteModal";

const GroupMemberDetails: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<string | undefined>();

  const router = useRouter();
  const { groupId, groupMemberId } = router.query;

  interface IState {
    grouppId: string;
    memberId: string;
  }

  const [ids, setIds] = useState<IState>({
    grouppId: "",
    memberId: "",
  });

  const { data: group } = trpc.groups.getById.useQuery(ids.grouppId);
  console.log("Group=", group);

  const member = trpc.groups.getById
    .useQuery(ids.grouppId as string)
    .data?.members.find((member) => member.memberId === ids.memberId);
  console.log("Member=", member);
  const memberOf = member?.member?.groups;
  const leaderOf = member?.member?.leaderOf;

  const removeMember = trpc.groups.removeMember.useMutation();

  useEffect(() => {
    if (typeof groupMemberId === "string") {
      setIds({ grouppId: groupId as string, memberId: groupMemberId });
    }
  }, [groupId, groupMemberId]);

  const handleRemove = async () => {
    await removeMember.mutateAsync({
      groupId: groupId as string,
      membersToRemove: [member?.id as string],
    });
    setIsModalOpen(undefined);
    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="p-4">
      <Button size="lg" onClick={() => router.back()}>
        Go Back To Group Members
      </Button>

      <div className="max-w-xxl my-5 w-full rounded-lg border bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h5 className="mb-3 ml-3 text-base font-semibold text-gray-900 dark:text-white md:text-xl">
          Member Details
        </h5>
        <ul className="my-4 space-y-3">
          <li key="Member name">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Member name: {member?.member?.fullName}
            </span>
          </li>
          <li key="Member id">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Member id: {member?.member?.id}
            </span>
          </li>
          <li key="Description">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Details: {member?.member?.details}
            </span>
          </li>
          <li key="Created by">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created by: {member?.member?.createdBy.name}
            </span>
          </li>
          <li key="MemberOf">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Member of:
              {memberOf?.map((group, index) => (
                <>
                  <Link
                    key={group.id}
                    href={`/groups/${group?.group?.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {group?.group?.name}
                  </Link>
                  {index < Number(memberOf?.length) - 1 ? ", " : null}
                </>
              ))}
            </span>
          </li>
          {leaderOf && leaderOf?.length > 0 ? (
            <li key="LeaderOf">
              <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                Leader of:{" "}
                {leaderOf?.map((group, index) => (
                  <>
                    <Link
                      key={group.id}
                      href={`/groups/${group?.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {group?.name}
                    </Link>
                    {index < Number(leaderOf.length) - 1 ? ", " : null}
                  </>
                ))}
              </span>
            </li>
          ) : null}

          <li key="Added">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Added to group: {member?.createdAt.toLocaleString()}
            </span>
          </li>

          <li key="Created at">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created at: {member?.member?.createdAt.toLocaleString()}
            </span>
          </li>
          <li key="Last update">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Last update : {member?.member?.updatedAt.toLocaleString()}
            </span>
          </li>
        </ul>
      </div>

      <div className="align-center flex justify-between">
        <Button
          size="lg"
          color="success"
          onClick={() =>
            router.push(
              `/groups/${groupId}/group-members/${groupMemberId}/edit`
            )
          }
        >
          Edit Member
        </Button>
        <Button color="failure" onClick={() => setIsModalOpen("default")}>
          Remove From Group
        </Button>
      </div>

      <DeleteModal
        message={`Are you sure you want to remove ${member?.member?.fullName} from ${group?.name}?`}
        handleAction={handleRemove}
        openModal={isModalOpen}
        setOpenModal={setIsModalOpen}
      />
    </div>
  );
};

export default GroupMemberDetails;
