"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api, setXApiKey } from "~/trpc/react";
import { useApiKeyStore } from "~/stores/useApiKeyStore";

export default function useApiKey() {
    const { data: session } = useSession();
    const { apiKey, setApiKey } = useApiKeyStore();

    const fetchedKeyData = api.apiKey.getKey.useQuery(undefined, {
        enabled: !!session && !apiKey,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (fetchedKeyData.data) {
            setApiKey(fetchedKeyData.data.apiKey);
            setXApiKey(fetchedKeyData.data.apiKey);
        }
    }, [fetchedKeyData.data]);
}
