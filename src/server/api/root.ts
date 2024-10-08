import { userRouter } from "~/server/api/routers/user";
import { apiKeyRouter } from "~/server/api/routers/apiKey";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { filesRouter } from "./routers/files";
import { notesRouter } from "./routers/notes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    apiKey: apiKeyRouter,
    user: userRouter,
    file: filesRouter,
    notes: notesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
