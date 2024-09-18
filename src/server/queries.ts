import "server-only";
import { db } from "./db";
import { files } from "./db/schema";
import { UploadedFileData } from "uploadthing/types";
import { getServerAuthSession } from "./auth";

export const insertFilesMetaDataToDb = async ({
    metadata,
    file,
}: {
    metadata: { userId: string };
    file: UploadedFileData;
}) => {
    await db.insert(files).values({
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
