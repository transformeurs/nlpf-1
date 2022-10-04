import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import React, { ReactElement, ReactNode } from "react";
import Head from "next/head";
import { NotificationsProvider } from "../context/NotificationContext";
import Notifications from "../components/notifications";
import { NextPage } from "next";
import { fetchFun } from "../utils/fetch";

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <SWRConfig
            value={{
                fetcher: fetchFun
            }}
        >
            <Head>
                <title>JobBoard</title>
            </Head>
            <NotificationsProvider>
                {getLayout(<Component {...pageProps} />)}
                <Notifications />
            </NotificationsProvider>
        </SWRConfig>
    );
}

export default MyApp;
