import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";

const GroupMemberDetails: NextPage = () => {
  const router = useRouter();
  const [memberId, setMemberId] = useState("");

  const { groupMemberId } = router.query;
  const member = trpc.members.getById.useQuery(memberId as string);
  console.log(member);

  useEffect(() => {
    if (typeof groupMemberId === "string") {
      setMemberId(groupMemberId);
    }
  }, [groupMemberId]);

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

export default GroupMemberDetails;