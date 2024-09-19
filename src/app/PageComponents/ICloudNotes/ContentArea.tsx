import { useNotesStore } from "~/stores/useNotesStore";
import { AddNotes, Delete } from "./NotesIcons";
import { api } from "~/trpc/react";
import { useCallback, useState } from "react";
import Loading from "~/app/_components/common/Loading";
import { debounce } from "lodash";

const ContentArea: React.FC = () => {
    const { setCurrentNote, currentNote, deleteNote, updateCurrentNote } =
        useNotesStore();
    const utils = api.useUtils();

    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const addNoteMutation = api.notes.addNote.useMutation({
        onSuccess: ({ noteId }) => {
            setCurrentNote(noteId);
            utils.notes.getNotes
                .invalidate()
                .then(() => {
                    console.log("Notes refetched");
                })
                .catch((error) => {
                    console.error("Error refetching notes:", error);
                });
            setLoading(false);
        },
        onError: (error) => {
            setLoading(false);
            console.error("Error adding note:", error);
        },
    });

    const editMutation = api.notes.editNote.useMutation({
        onSuccess: () => {
            utils.notes.getNotes
                .invalidate()
                .then(() => {
                    console.log("Notes refetched");
                })
                .catch((error) => {
                    console.error("Error refetching notes:", error);
                });
        },
    });

    const deleteNoteMutation = api.notes.deleteNote.useMutation({
        onSuccess: () => {
            utils.notes.getNotes
                .invalidate()
                .then(() => {
                    console.log("Notes refetched");
                })
                .catch((error) => {
                    console.error("Error refetching notes:", error);
                });
            setIsDeleting(false);
        },
        onError: (error) => {
            console.error("Error deleting note:", error);
            setIsDeleting(false);
        },
    });

    const debouncedEdit = useCallback(
        debounce((noteId: string, title: string, content: string) => {
            editMutation.mutate({ noteId, title, content });
        }, 500),
        [],
    );

    const handleNoteChange = (content: string) => {
        if (!currentNote) return;

        const title = content.split(" ").slice(0, 10).join(" ");
        updateCurrentNote(currentNote.id, { ...currentNote, content, title });
        debouncedEdit(currentNote.id, title, content);
    };

    const handleDeleteNote = () => {
        if (!currentNote) return;

        setIsDeleting(true);
        setCurrentNote(null);
        deleteNote(currentNote.id);

        deleteNoteMutation.mutate({ noteId: currentNote.id });
    };

    const handleAddNote = () => {
        setLoading(true);
        addNoteMutation.mutate({ title: "New Note", content: "" });
    };

    return (
        <div className="h-full w-full overflow-hidden">
            <div className="sticky top-0 flex items-center justify-end gap-2">
                <Delete
                    className={`mr-2 mt-2 h-5 w-5 cursor-pointer rounded-md fill-appleYellow p-2 hover:bg-hoverGray ${isDeleting ? "opacity-50" : ""}`}
                    onClick={handleDeleteNote}
                    disabled={isDeleting}
                />
                <AddNotes
                    className="mr-2 mt-2 h-5 w-5 cursor-pointer rounded-md fill-appleYellow p-2 hover:bg-hoverGray"
                    onClick={handleAddNote}
                />
            </div>
            <div className="h-full max-h-full">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loading />
                    </div>
                ) : currentNote ? (
                    <textarea
                        className="custom-area h-full w-full flex-grow resize-none overflow-y-auto bg-white p-4 text-xl focus:outline-none"
                        style={{ caretColor: "#F1C100" }}
                        placeholder="Type your notes here..."
                        value={currentNote.content}
                        onChange={(e) => handleNoteChange(e.target.value)}
                    />
                ) : (
                    <ShowMessage />
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

const ShowMessage: React.FC = () => (
    <div className="flex h-full w-full items-center justify-center text-2xl text-gray-500">
        Select a note to view or create a new note
    </div>
);

export default ContentArea;
