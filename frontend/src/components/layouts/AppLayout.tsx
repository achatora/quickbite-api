import { Outlet } from "react-router-dom";
import { SiteHeader } from "../organisms/SiteHeader";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-transparent text-ink">
      <SiteHeader />
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(226,235,214,0.45),transparent_68%)]" />
        <Outlet />
      </div>
    </div>
  );
}
