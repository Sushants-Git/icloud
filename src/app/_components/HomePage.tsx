"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Loading from "./common/Loading";
import NameDialog from "./NameDialog";
import { useLoadingStore } from "~/stores/useLoadingStore";
import useApiKey from "~/hooks/useApiKey";

export default function HomePage() {
  const { data: session, status } = useSession();

  useApiKey();

  const { isLoading } = useLoadingStore();
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
