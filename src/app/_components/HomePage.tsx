"use client";

import { useSession } from "next-auth/react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Loading from "./Loading";
import NameDialog from "./NameDialog";
import { useMemo } from "react";

export default function HomePage() {
    const { data: session, update, status } = useSession();

    const renderedContent = useMemo(() => {
        if (status === "loading") {
            return <Loading />;
        }

        if (status === "unauthenticated") {
            return <Login />;
        }

        if (!session) {
            return null;
        }

        if (session.user.name === null) {
            return <NameDialog userId={session.user.id} />;
        }

        return <Dashboard />;
    }, [status, session]);

    return <>{renderedContent}</>;
}
