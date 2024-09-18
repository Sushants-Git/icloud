import ContentArea from "./ContentArea";
import TopBar from "./TopBar";

const MainContent: React.FC<{ isSidebarOpen: boolean }> = ({
    isSidebarOpen,
}) => (
    <div className="flex w-full flex-col">
        <TopBar isSidebarOpen={isSidebarOpen} />
        <ContentArea />
    </div>
);

export default MainContent;