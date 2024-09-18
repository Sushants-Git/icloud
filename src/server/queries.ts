import "server-only";
import { db } from "./db";
import { files } from "./db/schema";
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
    const session = await getServerAuthSession();
    const userId = session?.user.id;

    if (!userId) throw new Error("Unauthorized");

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
