import { CircleChevronRightIcon } from "lucide-react";
import { FormEvent, useState } from "react";

interface NameDialogProps {
    nameId: string;
}

const NameDialog: React.FC<NameDialogProps> = ({ nameId }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (name.trim()) {
            console.log('Name submitted:', name);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Hey there! 👋</h2>
                    <p className="text-gray-600 mb-6">
                        Hey! It looks like this is your first time here.
                        To get started, please enter your name below. This helps us
                        personalize your experience.
                    </p>
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border border-gray-400 px-4 py-3 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            placeholder="Enter your name"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <CircleChevronRightIcon className="size-6" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NameDialog;
