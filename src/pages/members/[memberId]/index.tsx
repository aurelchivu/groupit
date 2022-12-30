import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const MemberDetails: NextPage = () => {
  const router = useRouter();
  const [id, setId] = useState("");

  const { memberId } = router.query;
  const member = trpc.members.getById.useQuery(id as string);
  console.log("Member", member);

  useEffect(() => {
    if (typeof memberId === "string") {
      setId(memberId);
    }
  }, [memberId]);

  return (
    <div className="p-4">
      <div className="py-4 px-4">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
      <h1>Member Id: {member.data?.id}</h1>
      <h1>Member First Name: {member.data?.fullName}</h1>
    </div>
  );
};

export default MemberDetails;