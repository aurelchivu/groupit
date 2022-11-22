import { type NextPage } from "next";
import Image from "next/image";
import Head from "next/head";

import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <div className="p-4">
        <h1 className="text-white">Home </h1>
      </div>
    </>
  );
};

export default Home;
