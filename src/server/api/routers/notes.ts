import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getServerAuthSession } from "~/server/auth";
import {
    addMyNote,
    deleteMyNote,
    editMyNote,
    getMyNotes,
} from "~/server/queries";

export const notesRouter = createTRPCRouter({
    getNotes: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/notes/getNotes",
                description: "Get all the notes for a specified user",
            },
        })
        .input(z.undefined())
        .output(
            z.object({
                notes: z.array(
                    z.object({
                        title: z.string(),
                        content: z.string(),
                        id: z.string(),
                        date: z.date().or(z.null()),
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

            let notes = null;

            try {
                notes = await getMyNotes(userId);
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to get your notes",
                });
            }

            return { notes: notes };
        }),
    addNote: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: "/notes/addNote",
                description: "Add a note",
            },
        })
        .input(
            z.object({
                title: z.string(),
                content: z.string(),
            }),
        )
        .output(
            z.object({
                noteId: z.string().or(z.null()),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const session = await getServerAuthSession();

            const userId = session?.user.id;

            if (!userId)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized",
                });

            let noteId = null;

            try {
                const fetchedNoteId = await addMyNote({
                    title: input.title,
                    content: input.content,
                });
                if (fetchedNoteId) {
                    noteId = fetchedNoteId;
                }
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to add note",
                });
            }

            return { noteId: noteId };
        }),
    deleteNote: protectedProcedure
        .meta({
            openapi: {
                method: "DELETE",
                path: "/notes/deleteNote",
                description: "Delete a note",
            },
        })
        .input(
            z.object({
                noteId: z.string(),
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
                const status = await deleteMyNote({ noteId: input.noteId });
                return { success: status.success };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to delete note",
                });
            }
        }),
    editNote: protectedProcedure
        .meta({
            openapi: {
                method: "PUT",
                path: "/notes/editNote",
                description: "Edit a note",
            },
        })
        .input(
            z.object({
                noteId: z.string(),
                title: z.string(),
                content: z.string(),
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
                const status = await editMyNote({
                    noteId: input.noteId,
                    title: input.title,
                    content: input.content,
                });
                return { success: status.success };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to edit note",
                });
            }
        }),
});
