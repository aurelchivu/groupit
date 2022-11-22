import { type NextPage } from "next";
import { Table, Checkbox } from "flowbite-react";
import Link from "next/link";

const Groups: NextPage = () => {
  return (
    <div className="p-4">
      <Table hoverable>
        <Table.Head >
          <Table.HeadCell className="!p-4"></Table.HeadCell>
          <Table.HeadCell>Group name</Table.HeadCell>
          <Table.HeadCell>Group ID</Table.HeadCell>
          <Table.HeadCell>Created at</Table.HeadCell>
          <Table.HeadCell>Updated at</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="!p-4">
              <Checkbox />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Apple MacBook Pro 17
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>Laptop</Table.Cell>
            <Table.Cell>$2999</Table.Cell>
            <Link
              href="/groups"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              <Table.Cell>Edit</Table.Cell>
            </Link>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="!p-4">
              <Checkbox />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Apple MacBook Pro 17
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>Laptop</Table.Cell>
            <Table.Cell>$2999</Table.Cell>
            <Link
              href="/groups"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              <Table.Cell>Edit</Table.Cell>
            </Link>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="!p-4">
              <Checkbox />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Apple MacBook Pro 17
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>Laptop</Table.Cell>
            <Table.Cell>$2999</Table.Cell>
            <Link
              href="/groups"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              <Table.Cell>Edit</Table.Cell>
            </Link>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="!p-4">
              <Checkbox />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Apple MacBook Pro 17
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>Laptop</Table.Cell>
            <Table.Cell>$2999</Table.Cell>
            <Link
              href="/groups"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              <Table.Cell>Edit</Table.Cell>
            </Link>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="!p-4">
              <Checkbox />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Apple MacBook Pro 17
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>Laptop</Table.Cell>
            <Table.Cell>$2999</Table.Cell>
            <Link
              href="/groups"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              <Table.Cell>Edit</Table.Cell>
            </Link>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="!p-4">
              <Checkbox />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Apple MacBook Pro 17
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>Laptop</Table.Cell>
            <Table.Cell>$2999</Table.Cell>
            <Link
              href="/groups"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              <Table.Cell>Edit</Table.Cell>
            </Link>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="!p-4">
              <Checkbox />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Apple MacBook Pro 17
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>Laptop</Table.Cell>
            <Table.Cell>$2999</Table.Cell>
            <Link
              href="/groups"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              <Table.Cell>Edit</Table.Cell>
            </Link>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};

export default Groups;
