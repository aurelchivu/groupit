import { type FC } from "react";
import Link from "next/link";
import type { Group, Member, GroupMembers } from "@/types/prismaTypes";

interface IProps {
  group?: Group;
  member?: Member;
  groupMember?: GroupMembers;
  leader?: GroupMembers;
}

const Details: FC<IProps> = ({ group, member, groupMember, leader }) => {
  return (
    <>
      {group && (
        <ul className="my-4 space-y-3">
          <li key="Group name">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Group name: {group?.name}
            </span>
          </li>
          <li key="Group id">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Group id: {group?.id}
            </span>
          </li>

          <li key="Description">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Description: {group?.description}
            </span>
          </li>
          <li key="Created by">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created by: {group?.createdBy.name || group?.createdBy.email}
            </span>
          </li>

          <li key="Leader">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Leader:
              {group?.leader ? (
                <Link
                  href={`/groups/${group?.id}/group-leader`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  {group?.leader?.fullName}
                </Link>
              ) : (
                " Not set yet "
              )}
            </span>
          </li>

          <li key="Members">
            <span className="group ml-3 flex  flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              {group?.members?.length === 0 ? (
                "No Members"
              ) : (
                <Link
                  href={`/groups/${group?.id}/group-members`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  {group?.members?.length && group?.members.length > 1
                    ? `${group?.members.length} Members`
                    : "1 Member"}
                </Link>
              )}
            </span>
          </li>
          <li key="Created at">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created at: {group?.createdAt.toLocaleString()}
            </span>
          </li>
          <li key="Last update">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Last update : {group?.updatedAt.toLocaleString()}
            </span>
          </li>
        </ul>
      )}

      {member && (
        <ul className="my-4 space-y-3">
          <li key="Member Name">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Member name: {member?.fullName}
            </span>
          </li>

          <li key="Member id">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Member id: {member?.id}
            </span>
          </li>
          <li key="Details">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Details: {member?.details}
            </span>
          </li>

          <li key="Created by">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created by: {member?.createdBy.name || member?.createdBy.email}
            </span>
          </li>
          {member?.groups && member?.groups?.length > 0 ? (
            <li key="MemberOf">
              <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                Member of:
                {member?.groups?.map((group, index) => (
                  <>
                    <Link
                      key={group.id}
                      href={`/groups/${group?.group?.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {group?.group?.name}
                    </Link>
                    {index === Number(member?.groups?.length) - 1 ? null : ", "}
                  </>
                ))}
              </span>
            </li>
          ) : null}

          {member?.leaderOf?.length > 0 ? (
            <li key="LeaderOf">
              <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                Leader of:{" "}
                {member?.leaderOf?.map((group, index) => (
                  <>
                    <Link
                      key={group.id}
                      href={`/groups/${group?.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {group?.name}
                    </Link>
                    {index === Number(member?.leaderOf.length) - 1
                      ? null
                      : ", "}
                  </>
                ))}
              </span>
            </li>
          ) : null}

          <li key="Created at">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created at: {member?.createdAt.toLocaleString()}
            </span>
          </li>
          <li key="Last update">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Last update : {member?.updatedAt.toLocaleString()}
            </span>
          </li>
        </ul>
      )}

      {leader && (
        <ul className="my-4 space-y-3">
          <li key="Leader name">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Leader name: {leader.member?.fullName}
            </span>
          </li>
          <li key="Leader id">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Group Leader id: {leader.member?.id}
            </span>
          </li>
          <li key="Description">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Details: {leader.member?.details}
            </span>
          </li>
          <li key="Created by">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created by:{" "}
              {leader?.member?.createdBy?.name ||
                leader?.member?.createdBy?.email}
            </span>
          </li>
          <li key="LeaderOf">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Member of:
              {leader.member?.groups?.map((group, index) => (
                <>
                  <Link
                    key={group.id}
                    href={`/groups/${group?.group?.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {group?.group?.name}
                  </Link>
                  {index < Number(leader.member?.groups?.length) - 1
                    ? ","
                    : null}
                </>
              ))}
            </span>
          </li>

          {leader.member?.leaderOf && leader?.member?.leaderOf?.length > 0 ? (
            <li key="LeaderOf">
              <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                Leader of:
                {leader.member?.leaderOf?.map((group, index) => (
                  <>
                    <Link
                      key={group.id}
                      href={`/groups/${group?.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {group?.name}
                    </Link>
                    {index < Number(leader.member?.leaderOf.length) - 1
                      ? ", "
                      : null}
                  </>
                ))}
              </span>
            </li>
          ) : null}

          <li key="Added">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Added to group: {leader?.createdAt.toLocaleString()}
            </span>
          </li>

          <li key="Created at">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created at: {leader.member?.createdAt.toLocaleString()}
            </span>
          </li>
          <li key="Last update">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Last update : {leader.member?.updatedAt.toLocaleString()}
            </span>
          </li>
        </ul>
      )}

      {groupMember && (
        <ul className="my-4 space-y-3">
          <li key="Member name">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Member name: {groupMember.member?.fullName}
            </span>
          </li>
          <li key="Member id">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Member id: {groupMember.member?.id}
            </span>
          </li>
          <li key="Description">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Details: {groupMember.member?.details}
            </span>
          </li>
          <li key="Created by">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created by: {groupMember.member?.createdBy.name || groupMember.member?.createdBy.email}
            </span>
          </li>
          <li key="MemberOf">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Member of:
              {groupMember.member?.groups?.map((group, index) => (
                <>
                  <Link
                    key={group.id}
                    href={`/groups/${group?.group?.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {group?.group?.name}
                  </Link>
                  {index < Number(groupMember.member?.groups?.length) - 1
                    ? ", "
                    : null}
                </>
              ))}
            </span>
          </li>
          {groupMember.member?.leaderOf &&
          groupMember.member?.leaderOf?.length > 0 ? (
            <li key="LeaderOf">
              <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                Leader of:{" "}
                {groupMember.member?.leaderOf?.map((group, index) => (
                  <>
                    <Link
                      key={group.id}
                      href={`/groups/${group?.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {group?.name}
                    </Link>
                    {index < Number(groupMember.member?.leaderOf.length) - 1
                      ? ", "
                      : null}
                  </>
                ))}
              </span>
            </li>
          ) : null}

          <li key="Added">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Added to group: {groupMember.createdAt.toLocaleString()}
            </span>
          </li>

          <li key="Created at">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Created at: {groupMember.member?.createdAt.toLocaleString()}
            </span>
          </li>
          <li key="Last update">
            <span className="group ml-3 flex flex-1 items-center whitespace-nowrap rounded-lg bg-gray-100 p-3 text-base font-bold text-gray-900 hover:bg-gray-200 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Last update : {groupMember.member?.updatedAt.toLocaleString()}
            </span>
          </li>
        </ul>
      )}
    </>
  );
};

export default Details;
