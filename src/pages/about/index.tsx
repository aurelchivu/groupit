import { type NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Navbar } from "flowbite-react";

import { trpc } from "../../utils/trpc";

const About: NextPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-white">About </h1>
    </div>
  );
};

export default About;
