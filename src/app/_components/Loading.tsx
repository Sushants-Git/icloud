export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-white">
            <div className="flex flex-col items-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-t-gray-600"></div>
                <p className="mt-4 font-sf-pro text-base font-medium text-gray-600">
                    Loading...
                </p>
            </div>
        </div>
    );
}
