import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";
import Header from "@/components/Header";
import Footerr from "@/components/Footerr";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Group IT - The best way to manage your groups</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class">
          <div className="flex h-screen flex-col items-stretch">
            <header className="h-15 sticky top-0 z-50 w-full ">
              <Header />
            </header>
            <main className="flex-grow">
              <Component {...pageProps} />
            </main>
            <footer className="h-15 sticky bottom-0 z-50 w-full">
              <Footerr />
            </footer>
          </div>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
