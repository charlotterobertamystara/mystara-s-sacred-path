import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar visível apenas no desktop */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main className="pb-20 lg:pb-0 lg:ml-64">
        <Outlet />
      </main>

      {/* Bottom nav visível apenas no mobile */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default AppLayout;
