import { type NextPage } from "next";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  return (
    <div className="p-10">
      <motion.h1
        className="mb-6 text-center text-2xl"
        initial={{ translateY: -200, scale: 0 }}
        animate={{ translateY: 0, scale: 1.2 }}
        transition={{ duration: 1.5 }}
      >
        Welcome to the ultimate group organization tool!
      </motion.h1>
      <motion.p
        className="text-left text-xl"
        initial={{ translateX: -2500, rotate: 90 }}
        animate={{ translateX: 0, rotate: 0 }}
        transition={{ duration: 1.5 }}
      >
        &emsp;Welcome to the ultimate solution for all your group organization
        needs! The app lets you manage your members and groups with ease, giving
        you the power to create, edit, and delete groups and members with just a
        few clicks. You have complete control over your groups and members, with
        the ability to add or remove members from groups, assign group leaders,
        and keep track of important dates such as when a member was added to a
        group or when a group or member was created or edited.
      </motion.p>

      <motion.p
        className="text-left text-xl"
        initial={{ translateX: 2500, rotate: -90 }}
        animate={{ translateX: 0, rotate: 0 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        &emsp;Only you, as the creator of the group and member, have the ability
        to edit or remove them. Filter and view only the groups and members that
        you have created, making it simple to stay on top of your organization.
        Our user-friendly interface and customizable features make it the
        perfect tool for managing large teams, organizing clubs, or keeping
        track of friends and family.
      </motion.p>
    </div>
  );
};

export default Home;
