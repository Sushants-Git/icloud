import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { deleteMyFile, getMyFiles } from "~/server/queries";

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
  deleteFile: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/files/deleteFile",
        description: "Delete a file",
      },
    })
    .input(
      z.object({
        fileId: z.string(),
      }),
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      const session = await getServerAuthSession();

      const userId = session?.user.id;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });

      try {
        const status = await deleteMyFile({ fileId: input.fileId });
        return { success: status.success };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete the file",
        });
      }
    }),
});
