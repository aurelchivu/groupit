import { type NextPage } from "next";
import { motion } from "framer-motion";

const About: NextPage = () => {
  return (
    <div className="p-10">
      <motion.h1
        className="mb-6 text-center text-2xl"
        initial={{ translateY: -200, scale: 0 }}
        animate={{ translateY: 0, scale: 1.2 }}
        transition={{ duration: 1.5 }}
      >
        About this app
      </motion.h1>
      <motion.p
        className="text-left text-xl"
        initial={{ translateX: -2500, rotate: 90 }}
        animate={{ translateX: 0, rotate: 0 }}
        transition={{ duration: 1.5 }}
      >
        &emsp;This group organization app is a modern and scalable solution,
        built using the latest web technologies. The application is built using
        Next.js for server-side rendering and optimized performance, TypeScript
        for type-safe and maintainable code, tRPC for fast and efficient
        communication between the backend and frontend, Prisma for powerful data
        management and access, and Tailwind CSS for fast and customizable
        styling.
      </motion.p>

      <motion.p
        className="text-left text-xl"
        initial={{ translateX: 2500, rotate: -90 }}
        animate={{ translateX: 0, rotate: 0 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        &emsp;The application allows the user to manage their groups and
        members, with the ability to create, edit, and delete groups and
        members, assign group leaders, and track important dates. The user has
        complete control over their groups and members, with only the creator of
        the group and member able to edit or delete them. The user can filter
        and view only the groups and members that they have created, making it
        easy to manage their groups and members efficiently.
      </motion.p>

      <motion.p
        className="text-left text-xl"
        initial={{ translateX: -2500, rotate: 90 }}
        animate={{ translateX: 0, rotate: 0 }}
        transition={{ delay: 1, duration: 1.5 }}
      >
        &emsp;The architecture of the application is designed to be scalable and
        maintainable, allowing for easy collaboration and future updates. The
        use of modern technologies and best practices ensures that the
        application is fast, efficient, and secure, making it a great choice for
        organizations looking for a powerful and reliable group organization
        solution.
      </motion.p>
    </div>
  );
};

export default About;
