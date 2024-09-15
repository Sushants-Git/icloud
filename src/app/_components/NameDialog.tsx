import { CircleChevronRightIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { FormEvent, useRef, useState } from "react";
import { api } from "~/trpc/react";
import Loading from "./Loading";
import { useLoadingStore } from "~/stores/useLoadingStore";

interface NameDialogProps {
    userId: string;
}

const NameDialog: React.FC<NameDialogProps> = ({ userId }) => {
    const [name, setName] = useState("");
    const {setLoading, isLoading} = useLoadingStore();
    const retryCount = useRef(0);
    const { update } = useSession();


    const addNameMutation = api.user.addName.useMutation({
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: async (data) => {
            await update();
            setName("");
            setLoading(false);
        },
        onError: async () => {
            if (retryCount.current < 2) {
                retryCount.current += 1;
                await addNameMutation.mutateAsync({ userId, name });
            } else {
                console.error("Failed to add name after retries.");
            }
            setLoading(false);
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await addNameMutation.mutateAsync({ userId, name });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
                <div className="p-6">
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                        Hey there! 👋
                    </h2>
                    <p className="mb-6 text-gray-600">
                        It looks like this is your first time here. To get started, please
                        enter your name below. This helps us personalize your experience.
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
