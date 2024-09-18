import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "~/app/api/uploadthing/core";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
    title: "iCloud huddle",
    description: "A personal icloud",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={"font-sf-pro"}>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <body>
                <SessionProvider refetchOnWindowFocus={false}>
                    <TRPCReactProvider>{children}</TRPCReactProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
