import Sidebar from "./Sidebar";
import Navbar from "../../_components/common/Navbar";
import { useEffect, useState } from "react";
import NotesMeta from "./NoteMeta";
import ContentArea from "./ContentArea";
import { useNotesStore } from "~/stores/useNotesStore";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

export default function ICloudNotesPage() {
    const { setNotes, notes } = useNotesStore();

    const { data: session } = useSession();

    const fetchedNotes = api.notes.getNotes.useQuery(undefined, {
        enabled: !!session,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (fetchedNotes.data) {
            setNotes(fetchedNotes.data.notes);
        }
    }, [fetchedNotes.data]);

    return (
        <div className="flex h-full flex-col">
            <Navbar isforHomeScreen={false} withTitle={"Notes"} />
            <div className="flex h-full">
                <div className="flex hidden w-[45%] md:flex">
                    <div className="flex flex-1 items-start justify-start border bg-appleSidebarblue text-2xl">
                        <Sidebar />
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-start gap-2 border bg-white pt-[11px] text-2xl">
                        {notes.map((note) => (
                            <NotesMeta
                                key={note.id}
                                title={note.title}
                                date={note.date}
                                id={note.id}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex w-full items-start justify-end border bg-white text-2xl md:w-[55%]">
                    <ContentArea />
                </div>
            </div>
        </div>
    );
}
