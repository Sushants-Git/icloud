"use client";

import { useSession } from "next-auth/react";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function HomePage() {
    const { data: session, update, status } = useSession();


    return (
        <>
            {status === "unauthenticated" || status === "loading" ? (
                <Login />
            ) : (
                <Dashboard />
            )}
        </>
    );
}
