import { useCallback, useState, type FC } from "react";
import Link from "next/link";
import type { Group, Member } from "@/types/prismaTypes";
import { Checkbox, Table } from "flowbite-react";
import { motion } from "framer-motion";

interface IProps {
  groups?: Group[];
  members?: Member[];
  groupMembers?: Group;
  addMembers?: Group;
  allMembers?: Member[];
  setLeader?: Group;
  changeLeader?: Group;
  groupId?: string | undefined;
  checkboxStates?: { [key: string]: boolean } | undefined;
  onCheckboxChange?: (memberId: string) => void;
}

const DataTable: FC<IProps> = ({
  groups,
  members,
  groupMembers,
  addMembers,
  allMembers,
  setLeader,
  changeLeader,
  groupId,
  checkboxStates,
  onCheckboxChange,
}) => {
  const [localCheckboxStates, setLocalCheckboxStates] = useState(
    checkboxStates || {}
  );
  const handleOnChange = useCallback(
    (memberId: string) => {
      setLocalCheckboxStates((prevState) => ({
        ...prevState,
        [memberId]: !prevState[memberId],
      }));
      onCheckboxChange ? onCheckboxChange(memberId) : null;
    },
    [onCheckboxChange]
  );

  return (
    <motion.div
      initial={{ translateY: 1500 }}
      animate={{ translateY: 0 }}
      transition={{ duration: 0.8 }}
    >
      {groups && (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Leader</Table.HeadCell>
            <Table.HeadCell>Created by</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Updated at</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {groups?.map((group, index) => (
              <Table.Row
                className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                key={group.id}
              >
                <Table.Cell className="!p-4">{index + 1}</Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 hover:scale-105 dark:text-white">
                  <Link
                    href={`/groups/${group.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {group.name}
                  </Link>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 hover:scale-105 dark:text-white">
                  {group.id}
                </Table.Cell>

                <Table.Cell>
                  {group.leader ? (
                    <Link
                      href={`/groups/${group?.id}/group-members/${group.leaderId}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {group.leader?.fullName}
                    </Link>
                  ) : (
                    "NOT SET YET"
                  )}
                </Table.Cell>
                <Table.Cell>
                  {group.createdBy.name || group.createdBy.email}
                </Table.Cell>
                <Table.Cell>{group.createdAt.toLocaleString()}</Table.Cell>
                <Table.Cell>{group.updatedAt.toLocaleString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {members && (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell>Full Name</Table.HeadCell>
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Created by</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Updated at</Table.HeadCell>
            <Table.HeadCell>Leader</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {members?.map((member, index) => (
              <Table.Row
                className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                key={member.id}
              >
                <Table.Cell className="!p-4">{index + 1}</Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Link
                    href={`/members/${member.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {member.fullName}{" "}
                  </Link>
                </Table.Cell>
                <Table.Cell>{member.id}</Table.Cell>
                <Table.Cell>
                  {member.createdBy.name || member.createdBy.email}
                </Table.Cell>
                <Table.Cell>{member.createdAt.toLocaleString()}</Table.Cell>
                <Table.Cell>{member.updatedAt.toLocaleString()}</Table.Cell>
                <Table.Cell>
                  {member?.leaderOf?.length > 0 ? "Yes" : "No"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {groupMembers && (
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
            {groupMembers?.members?.find((member) => member?.isLeader) && (
              <Table.Row
                className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                key={
                  groupMembers?.members?.find((member) => member?.isLeader)?.id
                }
              >
                <Table.Cell className="!p-4">1</Table.Cell>
                <Table.Cell className="!p-4">
                  <Checkbox
                    checked={
                      localCheckboxStates &&
                      localCheckboxStates[
                        groupMembers?.members?.find(
                          (member) => member?.isLeader
                        )?.id as string
                      ]
                    }
                    onChange={() =>
                      handleOnChange(
                        groupMembers?.members?.find(
                          (member) => member?.isLeader
                        )?.id as string
                      )
                    }
                  />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Link
                    href={`/groups/${groupId}/group-leader`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {
                      groupMembers?.members?.find((member) => member?.isLeader)
                        ?.member?.fullName
                    }
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {
                    groupMembers?.members?.find((member) => member?.isLeader)
                      ?.member?.id
                  }
                </Table.Cell>
                <Table.Cell>
                  {groupMembers?.members
                    ?.find((member) => member?.isLeader)
                    ?.createdAt.toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  {groupMembers?.members
                    ?.find((member) => member?.isLeader)
                    ?.member?.createdAt.toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  {groupMembers?.members
                    ?.find((member) => member?.isLeader)
                    ?.member?.updatedAt.toLocaleString()}
                </Table.Cell>
                <Table.Cell>LEADER</Table.Cell>
              </Table.Row>
            )}
            {groupMembers?.members
              .filter((member) => !member?.isLeader)
              ?.map((member, index) => (
                <Table.Row
                  className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                  key={member.id}
                >
                  <Table.Cell className="!p-4">
                    {groupMembers?.members?.find((member) => member?.isLeader)
                      ? index + 2
                      : index + 1}
                  </Table.Cell>
                  <Table.Cell className="!p-4">
                    <Checkbox
                      checked={
                        localCheckboxStates && localCheckboxStates[member?.id]
                      }
                      onChange={() => handleOnChange(member?.id)}
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
                  <Table.Cell>{member.member?.id}</Table.Cell>
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
      )}

      {addMembers && allMembers && (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell>Full Name</Table.HeadCell>
            <Table.HeadCell>Created by</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Updated at</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {allMembers
              ?.filter(
                (member) =>
                  !addMembers?.members?.some(
                    (groupMember) => groupMember.member?.id === member.id
                  )
              )
              ?.map((member) => (
                <Table.Row
                  className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                  key={member.id}
                >
                  <Table.Cell className="!p-4">
                    <Checkbox
                      checked={
                        localCheckboxStates && localCheckboxStates[member?.id]
                      }
                      onChange={() => handleOnChange(member?.id)}
                    />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link
                      href={`/members/${member.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {member.fullName}{" "}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {member.createdBy.name || member.createdBy.email}
                  </Table.Cell>
                  <Table.Cell>{member.createdAt.toLocaleString()}</Table.Cell>
                  <Table.Cell>{member.updatedAt.toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    <Link
                      href={`/members/${member.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Details
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      href={`/members/${member.id}/edit`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      )}

      {changeLeader && (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell>Full Name</Table.HeadCell>
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Added To Group</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Updated at</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {changeLeader?.members
              .filter((member) => member.isLeader === false)
              ?.map((member, index) => (
                <Table.Row
                  className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                  key={member.id}
                >
                  <Table.Cell className="!p-4">{index + 1}</Table.Cell>
                  <Table.Cell className="!p-4">
                    <Checkbox
                      checked={localCheckboxStates[member.id]}
                      onChange={() => handleOnChange(member.id)}
                    />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link
                      href={`/members/${member.memberId}`}
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
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      )}

      {setLeader?.members && (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell>Full Name</Table.HeadCell>
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Added To Group</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Updated at</Table.HeadCell>
            <Table.HeadCell>Leader</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {setLeader?.members?.map((member, index) => (
              <Table.Row
                className="delay-10 bg-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-violet-300 dark:border-gray-700 dark:bg-gray-800"
                key={member.id}
              >
                <Table.Cell className="!p-4">{index + 1}</Table.Cell>
                <Table.Cell className="!p-4">
                  <Checkbox
                    checked={localCheckboxStates[member.id]}
                    onChange={() => handleOnChange(member.id)}
                  />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Link
                    href={`/members/${member.memberId}`}
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
                <Table.Cell>{member.isLeader ? "Yes" : "No"}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </motion.div>
  );
};

export default DataTable;
