import { useNotesStore } from "~/stores/useNotesStore";
import { Browse } from "./NotesIcons";

const NotesMeta: React.FC<{
    title: string;
    date: Date | null;
    id: string;
}> = ({ title, date, id }) => {
    const { setCurrentNote } = useNotesStore();
    return (
        <div className="w-full px-2">
            <div className="cursor-pointer select-none rounded-lg bg-appleGray py-2 pl-5 pr-4 transition-colors duration-200 hover:bg-appleDarkGray" onClick={() => {
                console.log(id);
                setCurrentNote(id)
            }}>
                <h3 className="line-clamp-1 break-all text-lg font-semibold">
                    {title}
                </h3>
                <p className="text-sm text-gray-500">{getTimeFromDate(date)} No additional text</p>
                <div className="mt-1 flex items-center gap-1">
                    <Browse className="mr-1 h-4 w-4 fill-appleYellow" />
                    <span className="text-sm text-gray-500">All iCloud</span>
                </div>
            </div>
        </div>
    );
};

function getTimeFromDate(date: Date | null): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return '';
    }

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedHours = hours.toString().padStart(2, '0');

    return `${formattedHours}:${minutes} ${ampm}`;
}

export default NotesMeta;
