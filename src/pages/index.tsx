import { type NextPage } from "next";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <div className="p-4">
        <h1>{hello.data?.greeting}</h1>
      </div>
    </>
  );
};

export default Home;
