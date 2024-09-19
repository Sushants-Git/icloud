import "server-only";
import { db } from "./db";
import { files, notes } from "./db/schema";
import { UploadedFileData } from "uploadthing/types";
import { getServerAuthSession } from "./auth";
import { eq } from "drizzle-orm";
import { utapi } from "../app/api/uploadthing/core";

export const insertFilesMetaDataToDb = async ({
    metadata,
    file,
}: {
    metadata: { userId: string };
    file: UploadedFileData;
}) => {
    await db.insert(files).values({
        id: file.key,
        userId: metadata.userId,
        name: file.name,
        url: file.url,
        type: file.type,
        size: file.size,
    });

    return { fileId: file.key };
};

export const getMyFiles = async () => {
    const session = await getServerAuthSession();

    const userId = session?.user.id;

    if (!userId) throw new Error("Unauthorized");

    const files = await db.query.files.findMany({
        where: (files, { eq }) => eq(files.userId, userId),
        orderBy: (files) => files.date,
    });

    return files;
};

export const deleteMyFile = async ({ fileId }: { fileId: string }) => {
    await db.delete(files).where(eq(files.id, fileId));

    utapi
        .deleteFiles(fileId)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });

    return { success: true };
};

export const addMyNote = async ({
    title,
    content,
}: {
    title: string;
    content: string;
}) => {
    const session = await getServerAuthSession();

    const userId = session?.user.id;

    if (!userId) throw new Error("Unauthorized");

    const note = await db
        .insert(notes)
        .values({
            title,
            content,
            userId,
        })
        .returning({ id: notes.id });

    return note[0]?.id;
};

export const deleteMyNote = async ({ noteId }: { noteId: string }) => {
    try {
        await db.delete(notes).where(eq(notes.id, noteId));
    } catch (error) {
        throw new Error("Failed to delete note");
    }

    return { success: true };
};

export const editMyNote = async ({
    noteId,
    title,
    content,
}: {
    noteId: string;
    title: string;
    content: string;
}) => {
    try {
        await db
            .update(notes)
            .set({
                title,
                content,
            })
            .where(eq(notes.id, noteId));
    } catch (error) {
        throw new Error("Failed to edit note");
    }

    return { success: true };
};

interface Note {
    title: string;
    content: string;
    id: string;
    userId: string;
    date: Date | null;
}

export const getMyNotes = async (userId: string) => {
    const returnedNotes: Note[] = [];
    try {
        const fetchedNotes = await db.query.notes.findMany({
            where: (notes, { eq }) => eq(notes.userId, userId),
            orderBy: (notes) => notes.date,
        });
        fetchedNotes.forEach((notes) => {
            returnedNotes.push(
                {
                    title: notes.title,
                    content: notes.content,
                    id: notes.id,
                    date: notes.date,
                    userId: notes.userId,
                }
            );
        });
    } catch (error) {
        throw new Error("Failed to get your notes");
    }

    return returnedNotes;
};
