// function getCurrentTimestamp() {
//     const now = new Date();

//     const month = now.getMonth() + 1; // getMonth() returns 0-11
//     const day = now.getDate();
//     const year = now.getFullYear();

//     let hours = now.getHours();
//     const minutes = now.getMinutes().toString().padStart(2, '0');

//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'

//     return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
// }


function getFormattedTimestamp(inputDate: Date | null): string {
    const date: Date = inputDate instanceof Date ? inputDate : new Date();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();
    const year: number = date.getFullYear();

    let hours: number = date.getHours();
    const minutes: string = date.getMinutes().toString().padStart(2, '0');

    const ampm: string = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
}

function humanReadableSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    const roundedSize = size.toFixed(1);

    const formattedSize = roundedSize.endsWith('.0') ? Math.round(size) : roundedSize;

    return `${formattedSize} ${sizes[i]}`;
}

export { getFormattedTimestamp, humanReadableSize };
