import AdvanceSidebar from "../AdvanceSidebar";
import { Header } from "../header";
import SessionGuard from "../session/SessionGuard";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <AdvanceSidebar>
      <SessionGuard />
      <Header />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {children}
      </div>
    </AdvanceSidebar>
  );
};

export default MainLayout;
