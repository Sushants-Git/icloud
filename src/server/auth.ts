import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import getServerSession, { NextAuthConfig, type DefaultSession } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import Passkey from "next-auth/providers/passkey";

import { db } from "~/server/db";
import {
    accounts,
    sessions,
    users,
    verificationTokens,
    authenticator
} from "~/server/db/schema";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

export const { auth, handlers } = NextAuth({
    debug: true,
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
        authenticatorsTable: authenticator
    }) as Adapter,
    providers: [Passkey],
    experimental: { enableWebAuthn: true },
});

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
// export const getServerAuthSession = () => getServerSession(authOptions);
export const getServerAuthSession = () => auth();
