import { useSession } from "next-auth/react";
import Login from "../login";

const User = () => {
  const { data: session } = useSession();

  if (!session) {
    // Handle unauthenticated state, e.g. render a SignIn component
    return <Login />;
  }

  return <p>Welcome {session.user?.name}!</p>;
};

export default User;
