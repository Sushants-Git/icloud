import { useSession } from "next-auth/react";

import Clock from "/public/drive-icons/recents.svg";
import FilesArea from "./FilesArea";
import { subtractFromGB } from "~/utils/util";
import { useFiles } from "~/hooks/useFiles";

const ContentArea: React.FC = () => {
  const { data: session } = useSession();

  const { fetchedFiles } = useFiles();

  return (
    <div className="flex flex-grow flex-col bg-white p-8 pt-4">
      <div>
        <h1 className="mb-2 flex items-center gap-3 text-2xl font-semibold">
          <Clock className="h-5 w-5 fill-[#0000007a]" />
          Recents
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          {fetchedFiles?.length ?? 0} items,{" "}
          {subtractFromGB(
            1,
            fetchedFiles.reduce((acc, file) => acc + file.size, 0),
          )}{" GB "}
          available
        </p>
      </div>

      <FilesArea files={fetchedFiles} />
    </div>
  );
};

export default ContentArea;
