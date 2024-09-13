import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  const posts = await db.query.users.findMany();
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="h-full w-full bg-sky-500 bg-[url('/main-background.webp')] bg-cover bg-[50%_center]">
        {posts[0]?.name}
      </main>
    </HydrateClient>
  );
}
