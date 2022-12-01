import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import CustomLink from "./CustomLink";
import { Navbar, type NavbarComponentProps } from "flowbite-react";
import { signIn, signOut, useSession } from "next-auth/react";

const Header: FC<NavbarComponentProps> = () => {
  const { data: session } = useSession();
  console.log(session);

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/" });
  };

  const handleSignIn = async () => {
    await signIn(undefined, { callbackUrl: "/" });
  };

  return (
    <Navbar fluid rounded className="mx-1 bg-red-300">
      <Link href="/">
        <div className="flex items-center">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Group IT
          </span>
        </div>
      </Link>
      <Navbar.Toggle />
      {session ? (
        <Navbar.Collapse>
          <Link href="/groups">Groups</Link>
          <Link href="/people">People</Link>
          <Link href="/api/auth/signout" onClick={() => handleSignOut}>
            Logout, {session?.user?.name}
          </Link>
        </Navbar.Collapse>
      ) : (
        <Navbar.Collapse>
          <Link href="/api/auth/signin" onClick={() => handleSignIn}>
            Login/Register
          </Link>
          <Link href="/about">About</Link>
        </Navbar.Collapse>
      )}
    </Navbar>
  );
};

export default Header;
