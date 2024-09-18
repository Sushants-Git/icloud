import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { getMyFiles } from "~/server/queries";

export const filesRouter = createTRPCRouter({
    getFiles: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/files/getFiles",
                description: "Get all the drive files for a specified user",
            },
        })
        .input(z.undefined())
        .output(
            z.object({
                files: z.array(
                    z.object({
                        name: z.string(),
                        size: z.number(),
                        type: z.string(),
                        url: z.string(),
                        date: z.date().or(z.null()),
                        id: z.string(),
                        userId: z.string(),
                    }),
                ),
            }),
        )
        .query(async () => {
            const session = await getServerAuthSession();

            const userId = session?.user.id;

            if (!userId)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized",
                });

            let files = null;

            try {
                files = await getMyFiles();
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to get your files",
                });
            }

            return { files: files };
        }),
});
