import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Navbar, type NavbarComponentProps } from "flowbite-react";

const Header: FC<NavbarComponentProps> = () => {
  return (
    <Navbar fluid rounded>
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
      <Navbar.Collapse>
        <Link href="/groups">Groups</Link>
        <Link href="/people">People</Link>
        <Link href="/about">About</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
