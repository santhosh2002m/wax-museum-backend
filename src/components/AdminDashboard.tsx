import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";

export type DashboardView =
  | "today"
  | "last-7-days"
  | "last-30-days"
  | "year"
  | "calendar-view"
  | "edit-profile"
  | "add-counter"
  | "delete-counter"
  | "ticket-details"
  | "guide-score";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<DashboardView>("today");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AdminSidebar
            currentView={currentView}
            onViewChange={setCurrentView}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuToggle={handleMobileMenuToggle}
          />

          <div className="flex-1 flex flex-col">
            <DashboardHeader onMobileMenuToggle={handleMobileMenuToggle} />

            <main className="flex-1 p-6 lg:p-8">
              <DashboardContent currentView={currentView} />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboard;
