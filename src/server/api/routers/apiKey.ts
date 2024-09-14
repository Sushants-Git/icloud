import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const apiKeyRouter = createTRPCRouter({
    getKey: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/apiKey/getKey",
                description: "Get the x-api-key",
            },
        })
        .input(z.undefined())
        .output(
            z.object({
                apiKey: z.string(),
            }),
        )
        .query(() => {
            return {
                apiKey:
                    "f7695f9920bf637b831a2c2d497182d86f31216c4b941f12408b5501cdbf3e05",
            };
        }),
});
