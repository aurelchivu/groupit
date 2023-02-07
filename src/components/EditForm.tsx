import { Button, Label, TextInput } from "flowbite-react";
import { motion } from "framer-motion";
import { type FC } from "react";
import { useRouter } from "next/router";

interface IGroup {
  name: string;
  description: string;
}

interface IMember {
  fullName: string;
  details: string;
}

interface IProps {
  name: string | undefined;
  groupFormData?: IGroup;
  setGroupFormData?: (groupFormData: IGroup) => void;
  memberFormData?: IMember;
  setMemberFormData?: (memberFormData: IMember) => void;
  submitUpdate: (e: React.SyntheticEvent) => void;
}

const EditForm: FC<IProps> = ({
  name,
  groupFormData,
  setGroupFormData,
  memberFormData,
  setMemberFormData,
  submitUpdate,
}) => {
  const router = useRouter();
  return (
    <div className="px-40 py-4 ">
      <motion.div
        className="align-center flex justify-between"
        initial={{ translateX: -500 }}
        animate={{ translateX: 0 }}
        transition={{ duration: 1 }}
      >
        <Button size="lg" onClick={() => router.back()}>
          Go back
        </Button>
      </motion.div>
      {groupFormData && setGroupFormData && (
        <form className="flex flex-col gap-5 py-20" onSubmit={submitUpdate}>
          <motion.h1
            className="text-xl"
            initial={{ translateX: 1500 }}
            animate={{ translateX: 0 }}
            transition={{ duration: 0.8 }}
          >
            Edit group {name}
          </motion.h1>
          <motion.div
            initial={{ rotate: 180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-2 block">
              <Label htmlFor="name" value="Group name" />
            </div>
            <TextInput
              id="name"
              type="text"
              required={true}
              value={groupFormData.name}
              onChange={(e) => {
                setGroupFormData({ ...groupFormData, name: e.target.value });
              }}
            />
          </motion.div>

          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-2 block">
              <Label htmlFor="base" value="Group description" />
            </div>
            <textarea
              id="description"
              rows={3}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              value={groupFormData.description}
              onChange={(e) => {
                setGroupFormData({
                  ...groupFormData,
                  description: e.target.value,
                });
              }}
            ></textarea>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ translateY: 2000 }}
            animate={{ translateY: 0 }}
            transition={{ duration: 1 }}
          >
            <Button type="submit" size="lg" color="success">
              Save
            </Button>
          </motion.div>
        </form>
      )}

      {memberFormData && setMemberFormData && (
        <form className="flex flex-col gap-5 py-20" onSubmit={submitUpdate}>
          <motion.h1
            className="text-xl"
            initial={{ translateX: 1500 }}
            animate={{ translateX: 0 }}
            transition={{ duration: 0.8 }}
          >
            Edit member {name}
          </motion.h1>
          <motion.div
            initial={{ rotate: 180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-2 block">
              <Label htmlFor="firstName" value="Member full name" />
            </div>
            <TextInput
              id="memberFirstName"
              type="text"
              required={true}
              value={memberFormData.fullName}
              onChange={(e) => {
                setMemberFormData({
                  ...memberFormData,
                  fullName: e.target.value,
                });
              }}
            />
          </motion.div>

          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-2 block">
              <Label htmlFor="base" value="Member details" />
            </div>
            <textarea
              id="details"
              rows={3}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              value={memberFormData.details}
              onChange={(e) => {
                setMemberFormData({
                  ...memberFormData,
                  details: e.target.value,
                });
              }}
            ></textarea>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ translateY: 2000 }}
            animate={{ translateY: 0 }}
            transition={{ duration: 1 }}
          >
            <Button type="submit" size="lg" color="success">
              Save
            </Button>
          </motion.div>
        </form>
      )}
    </div>
  );
};

export default EditForm;
