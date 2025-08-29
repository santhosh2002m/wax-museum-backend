import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

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
  | "guide-score"
  | "crm-dashboard";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<DashboardView>("today");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    fetchTodayAnalytics,
    fetchLast7DaysAnalytics,
    fetchLast30DaysAnalytics,
    fetchAnnualAnalytics,
  } = useData();
  const { logout } = useAuth();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Fetch data when view changes (excluding CRM dashboard)
  useEffect(() => {
    // Don't fetch data when switching to CRM dashboard
    if (currentView === "crm-dashboard") return;

    const fetchData = async () => {
      switch (currentView) {
        case "today":
          await fetchTodayAnalytics();
          break;
        case "last-7-days":
          await fetchLast7DaysAnalytics();
          break;
        case "last-30-days":
          await fetchLast30DaysAnalytics();
          break;
        case "year":
          await fetchAnnualAnalytics();
          break;
        default:
          // Other views don't need data fetching on view change
          break;
      }
    };

    fetchData();
  }, [
    currentView,
    fetchTodayAnalytics,
    fetchLast7DaysAnalytics,
    fetchLast30DaysAnalytics,
    fetchAnnualAnalytics,
  ]);

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
