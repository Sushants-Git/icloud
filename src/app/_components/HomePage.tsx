"use client";

import { useSession } from "next-auth/react";
import Login from "./Login";
import Dashboard from "./Dashboard/Dashboard";
import Loading from "./Loading";
import NameDialog from "./NameDialog";
import { useEffect, useMemo, useRef } from "react";
import { useApiKeyStore } from "~/stores/useApiKeyStore";
import { api, XApiKey, setXApiKey } from "~/trpc/react";
import { useLoadingStore } from "~/stores/useLoadingStore";

export default function HomePage() {
    const { data: session, update, status } = useSession();
    const { isLoading } = useLoadingStore();
    const fetchedKeyData = api.apiKey.getKey.useQuery(undefined, {
        enabled: !!session,
        refetchOnWindowFocus: false,
    });
    const { setApiKey } = useApiKeyStore();

    useEffect(() => {
        if (fetchedKeyData.data) {
            setXApiKey(fetchedKeyData.data.apiKey);
        }
    }, [fetchedKeyData.data]);

    const renderedContent = useMemo(() => {
        if (status === "loading" || isLoading) {
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
