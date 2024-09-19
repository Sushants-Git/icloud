import { create } from "zustand";

interface Note {
    title: string;
    content: string;
    id: string;
    userId: string;
    date: Date | null;
}

interface NotesState {
    notes: Note[];
    currentNote: Note | null;
    setNotes: (notes: Note[]) => void;
    setCurrentNote: (noteId: string | null) => void;
    updateCurrentNote: (id: string, note: Note) => void;
    addNote: (newNote: Note) => void;
    deleteNote: (noteId: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
    notes: [],
    currentNote: null,
    setNotes: (notes: Note[]) => set({ notes }),
    setCurrentNote: (noteId: string | null) => {
        set((state) => ({
            currentNote: state.notes.find((note) => note.id === noteId) ?? null,
        }));
    },
    updateCurrentNote: (id: string, note: Note) => {
        set((state) => ({
            currentNote: {
                ...state.currentNote,
                ...note,
            },
            notes: state.notes.map((n) => (n.id === id ? note : n)),
        }));
    },
    addNote: (newNote: Note) =>
        set((state) => ({ notes: [...state.notes, newNote] })),
    deleteNote: (noteId: string) => {
        set((state) => ({
            notes: state.notes.filter((note) => note.id !== noteId),
            currentNote: state.currentNote?.id === noteId ? null : state.currentNote,
        }));
    },
}));
