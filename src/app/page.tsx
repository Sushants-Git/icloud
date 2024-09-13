import { db } from "~/server/db";
import { api, HydrateClient } from "~/trpc/server";
import { useSession } from "next-auth/react";
import HomePage from "~/app/_components/HomePage";

export const dynamic = "force-dynamic";

export default async function Home() {
    // const hello = await api.post.hello({ text: "from tRPC" });

    // const posts = await db.query.users.findMany();
    // void api.post.getLatest.prefetch();

    return (
        <HydrateClient>
            <HomePage />
        </HydrateClient>
    );
}
