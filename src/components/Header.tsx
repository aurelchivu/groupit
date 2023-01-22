import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Navbar, type NavbarComponentProps } from "flowbite-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

const Header: FC<NavbarComponentProps> = () => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/" });
  };

  const handleSignIn = async () => {
    await signIn(undefined, { callbackUrl: "/" });
  };

  return (
    <Navbar
      fluid
      rounded
      className="bg-gradient-to-r from-[#857995] to-[#d0d2f5] opacity-90"
    >
      <Link href="/">
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            className="mr-3 h-6 sm:h-9"
            width={30}
            height={30}
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Group IT
          </span>
        </div>
      </Link>
      <Navbar.Toggle />
      <div className="flex items-center justify-between">
        {session ? (
          <Navbar.Collapse>
            <Link href="/groups">Groups</Link>
            <Link href="/members">Members</Link>
            <Link href="/api/auth/signout" onClick={() => handleSignOut}>
              Logout, {session?.user?.name || session?.user?.email}
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
        <button
          className="ml-3 rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          data-testid="dark-theme-toggle"
          type="button"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 20 20"
              aria-label="Currently dark mode"
              className="h-5 w-5"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 20 20"
              aria-label="Currently light mode"
              className="h-5 w-5"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
          )}
        </button>
      </div>
    </Navbar>
  );
};

export default Header;
