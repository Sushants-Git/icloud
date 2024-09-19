import { Clock, Browse, Trash, SidebarIcon, Delete } from "./NotesIcons";

import SidebarItem from "./SidebarItem";

const Sidebar: React.FC = () => {
    return (
        <div className="relative bg-appleSidebarblue">
            <div>
                <div className="p-4 pb-0 pt-[11px]">
                    <SidebarItem
                        icon={<Browse className="h-4 w-4 fill-appleYellow" />}
                        label="All iCloud"
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
