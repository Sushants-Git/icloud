import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema"; // Your users table
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const API_KEY = "f7695f9920bf637b831a2c2d497182d86f31216c4b941f12408b5501cdbf3e05";

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
    getAllUsers: publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/user/getAllUsers",
                description: "Get all users (protected by x-api-key)",
            },
        })
        .input(z.undefined())
        .output(
            z.object({
                users: z.array(
                    z.object({
                        id: z.string(),
                        name: z.string().nullable(),
                        email: z.string().nullable(),
                    })
                ),
            })
        )
        .query(async ({ ctx }) => {
            const providedApiKey = ctx.headers.get("x-api-key");

            if (providedApiKey !== API_KEY) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid API key",
                });
            }

            try {
                const allUsers = await ctx.db.select().from(users);
                return { users: allUsers };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch users",
                });
            }
        }),
});
