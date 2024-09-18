import { motion, AnimatePresence } from "framer-motion";

import { Clock, Browse, Trash, SidebarIcon } from "./DriveIcons";

import SidebarItem from "./SidebarItem";

const Sidebar: React.FC<{
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}> = ({ isSidebarOpen, toggleSidebar }) => {
    return (
        <div className="relative bg-appleSidebarblue">
            <button
                onClick={toggleSidebar}
                className="absolute left-4 top-[17px] z-10 rounded-md p-2 transition-colors duration-200 hover:bg-appleGray"
            >
                <SidebarIcon className="h-5 w-5 fill-appleBlue" />
            </button>
            <AnimatePresence initial={false}>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 256 }}
                        exit={{ width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="w-64 border-r border-r-appleGray">
                            <div className="p-4 pb-0 pt-[11px]">
                                <div className="h-9 w-9" />
                                <SidebarItem
                                    icon={<Clock className="h-4 w-4 fill-appleBlue" />}
                                    label="Recents"
                                />
                                <SidebarItem
                                    icon={<Browse className="h-5 w-5 fill-appleBlue" />}
                                    label="Browse"
                                />
                                <SidebarItem
                                    icon={<Trash className="h-5 w-5 fill-appleBlue" />}
                                    label="Recently Deleted"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Sidebar;