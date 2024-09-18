import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFilesStore } from "~/stores/useFilesStore";
import { api } from "~/trpc/react";

export const useFiles = () => {
    const { data: session } = useSession();

    const { fetchedFiles, setFetchedFiles } = useFilesStore();

    const filesFromApi = api.file.getFiles.useQuery(undefined, {
        enabled: !!session,
        refetchOnWindowFocus: false,
    }).data?.files;

    useEffect(() => {
        if (filesFromApi) {
            setFetchedFiles(filesFromApi);
            return;
        }
    }, [setFetchedFiles, filesFromApi]);

    return { fetchedFiles };
};
