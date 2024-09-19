import { useNotesStore } from "~/stores/useNotesStore";
import { AddNotes, Delete } from "./NotesIcons";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

const ContentArea: React.FC = () => {
    const utils = api.useUtils();
    const { setCurrentNote, currentNote, deleteNote } = useNotesStore();
    const util = api.useUtils();
    const addNoteMutation = api.notes.addNote.useMutation({
        onSuccess: ({ noteId }) => {
            setCurrentNote(noteId);
            util.notes.getNotes.invalidate().then(() => {
                console.log("Notes invalidated");
            }).catch((error) => {
                console.error("Error invalidating notes:", error);
            })
        },
    });

    const editMutation = api.notes.editNote.useMutation();

    const deleteNoteMutation = api.notes.deleteNote.useMutation({
        onSuccess: () => {
            util.notes.getNotes.invalidate().then(() => {
                console.log("Notes invalidated");
            }).catch((error) => {
                console.error("Error invalidating notes:", error);
            })
        },
    });

    const [tempNoteText, setTempNoteText] = useState({
        id: currentNote?.id,
        content: currentNote?.content ?? "",
    });

    useEffect(() => {
        if (currentNote?.id !== tempNoteText.id) {
            setTempNoteText({
                id: currentNote?.id,
                content: currentNote?.content ? currentNote.content : "",
            });
        }

        const id = setTimeout(() => {
            if (currentNote === null) return;
            editMutation.mutate({
                noteId: currentNote.id,
                title: tempNoteText.content.split(" ").slice(0, 10).join(" "),
                content: tempNoteText.content,
            });
            util.notes.getNotes.invalidate().then(() => {
                console.log("Notes invalidated");
            }).catch((error) => {
                console.error("Error invalidating notes:", error);
            })
        }, 500);

        return () => clearTimeout(id);
    }, [tempNoteText, currentNote]);

    return (
        <div className="h-full w-full overflow-hidden">
            <div className="sticky top-0 flex items-center justify-end gap-2">
                <Delete
                    className="mr-2 mt-2 h-5 w-5 cursor-pointer rounded-md fill-appleYellow p-2 hover:bg-hoverGray"
                    onClick={() => {
                        if (currentNote === null) return;
                        deleteNoteMutation
                            .mutateAsync({ noteId: currentNote.id })
                            .then(async () => {
                                await util.notes.getNotes.invalidate();
                            })
                            .catch((error) => {
                                console.error("Error deleting file:", error);
                            });

                        setCurrentNote(null);

                        if (currentNote) {
                            deleteNote(currentNote?.id);
                        }
                    }}
                />
                <div>
                    <AddNotes
                        className="mr-2 mt-2 h-5 w-5 cursor-pointer rounded-md fill-appleYellow p-2 hover:bg-hoverGray"
                        onClick={() => {
                            addNoteMutation.mutate({ title: "New Note", content: "" });
                        }}
                    />
                </div>
            </div>
            <div className="h-full max-h-full">
                {currentNote ? (
                    <textarea
                        className="custom-area h-full w-full flex-grow resize-none overflow-y-auto bg-white p-4 text-xl focus:outline-none"
                        style={{ caretColor: "#F1C100" }}
                        placeholder="Type your notes here..."
                        value={
                            tempNoteText.content === ""
                                ? currentNote?.content
                                : tempNoteText.content
                        }
                        onChange={(e) => {
                            setTempNoteText((state) => {
                                return {
                                    ...state,
                                    content: e.target.value,
                                };
                            });
                        }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl text-gray-500">
                        Select a note to view or create a new note
                    </div>
                )}
            </div>
            <style>
                {`
          .custom-area::selection {
            background-color: lightyellow;
            color: black;
          }
        `}
            </style>
        </div>
    );
};

export default ContentArea;
