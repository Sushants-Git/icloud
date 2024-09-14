"use client";

import { useSession } from "next-auth/react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Loading from "./Loading";
import NameDialog from "./NameDialog";

export default function HomePage() {
    const { data: session, update, status } = useSession();

    console.log(session);

    const renderContent = () => {
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
    };

    return (
        <>
            {renderContent()}
        </>
    );
}
