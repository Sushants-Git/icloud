import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth, getServerAuthSession } from "~/server/auth";
import { insertFilesMetaDataToDb } from "~/server/queries";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    Uploader: f({
        image: { maxFileSize: "64MB", maxFileCount: 10 },
        text: { maxFileSize: "64MB", maxFileCount: 10 },
        pdf: { maxFileSize: "64MB", maxFileCount: 10 },
        blob: { maxFileSize: "64MB", maxFileCount: 10 },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload

            const session = await getServerAuthSession();

            const user = session?.user;

            // If you throw, the user will not be able to upload

            console.log(user);

            if (!user?.id)
                throw new UploadThingError(
                    `Unauthorizedddddddd ${JSON.stringify(user)}`,
                );

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);

            await insertFilesMetaDataToDb({ metadata, file });

            // await db.insert(files).values({
            //     userId: metadata.userId,
            //     name: file.name,
            //     url: file.url,
            //     type: file.type,
            //     size: file.size,
            // });
            // const posts = await db.query.users.findMany();

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { fileId: file.key };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
