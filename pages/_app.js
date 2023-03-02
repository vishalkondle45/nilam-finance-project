import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { NotificationsProvider } from "@mantine/notifications";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <Head>
        <title>Nilam Finance</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <NotificationsProvider>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}
