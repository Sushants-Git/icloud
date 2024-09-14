"use client";

import { useSession } from "next-auth/react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Loading from "./Loading";
import NameDialog from "./NameDialog";

export default function HomePage() {
    const { data: session, update, status } = useSession();

    console.log(session);

    return (
        <>
            {status === "loading" ? (
                <Loading />
            ) : status === "unauthenticated" ? (
                <Login />
            ) : (
                session?.user.name === null ? <NameDialog userId={session?.user.id} /> :
                    <Dashboard />
            )}
        </>
    );
}
