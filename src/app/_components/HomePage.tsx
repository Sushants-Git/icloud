"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { api, setXApiKey } from "~/trpc/react";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Loading from "./common/Loading";
import NameDialog from "./NameDialog";
import { useLoadingStore } from "~/stores/useLoadingStore";

export default function HomePage() {
  const { data: session, status } = useSession();
  const { isLoading } = useLoadingStore();
  const fetchedKeyData = api.apiKey.getKey.useQuery(undefined, {
    enabled: !!session,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (fetchedKeyData.data) {
      setXApiKey(fetchedKeyData.data.apiKey);
    }
  }, [fetchedKeyData.data]);

  const renderedContent = useMemo(() => {
    if (status === "loading" || isLoading) return <Loading />;
    if (status === "unauthenticated") return <Login />;
    if (!session) return null;
    if (session.user.name === null)
      return <NameDialog userId={session.user.id} />;

    return <Dashboard />;
  }, [status, session]);

  return <>{renderedContent}</>;
}
