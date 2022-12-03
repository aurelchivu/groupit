import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const GroupContent: NextPage = () => {
  const router = useRouter();
  const [groupId, setGroupId] = useState("");

  const { id } = router.query;
  const group = trpc.groups.getById.useQuery(groupId as string);
  // console.log(group);

  useEffect(() => {
    if (id) {
      setGroupId(id as string);
    }
  }, [id]);

  return (
    <div className="p-4">
      <div className="py-4 px-4">
        <Button size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
      <h1>Group groupId: {id}</h1>
      <h1>Group name: {group.data?.name}</h1>
    </div>
  );
};

export default GroupContent;
