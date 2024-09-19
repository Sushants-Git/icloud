const SidebarItem: React.FC<{
    icon: JSX.Element;
    label: string;
}> = ({ icon, label }) => {
    let extraStyle = "";

    if (label === "Recents") {
        extraStyle = "mt-4";
    }

    return (
        <div
            className={`flex cursor-pointer items-center space-x-2 rounded-[10px] p-2 pr-32 hover:bg-appleGray ${extraStyle}`}
        >
            {icon}
            <span className="text-sm">{label}</span>
        </div>
    );
};

export default SidebarItem;
