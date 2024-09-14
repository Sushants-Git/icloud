import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema"; // Your users table
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
    addName: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: "/user/addName",
                description: "Update the name of a user",
            },
        })
        .input(
            z.object({
                userId: z.string(),
                name: z.string(),
            }),
        )
        .output(
            z.object({
                success: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { userId, name } = input;

            console.log({ userId, name });

            if (ctx.session.user.id !== userId) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are not allowed to update this user.",
                });
            }

            try {
                await ctx.db.update(users).set({ name }).where(eq(users.id, userId));
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update the user name.",
                });
            }

            return { success: true };
        }),
});
