import {
  Calendar,
  Clock,
  TrendingUp,
  CalendarDays,
  User,
  Plus,
  Trash2,
  Ticket,
  Award,
  LogOut,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { DashboardView } from "./AdminDashboard";
import logoImage from "../../public/logo.png";

interface AdminSidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const sidebarItems = [
  { id: "today", label: "Today", icon: Clock, variant: "primary" },
  {
    id: "last-7-days",
    label: "Last 7 Days",
    icon: Calendar,
    variant: "default",
  },
  {
    id: "last-30-days",
    label: "Last 30 Days",
    icon: TrendingUp,
    variant: "default",
  },
  { id: "year", label: "Year", icon: CalendarDays, variant: "default" },
  {
    id: "calendar-view",
    label: "Calendar View",
    icon: Calendar,
    variant: "default",
  },
  {
    id: "ticket-details",
    label: "Ticket Details",
    icon: Ticket,
    variant: "default",
  },
  { id: "guide-score", label: "Guide Score", icon: Award, variant: "default" },
  {
    id: "add-counter",
    label: "Add New Counter",
    icon: Plus,
    variant: "default",
  },
  { id: "edit-profile", label: "Edit Profile", icon: User, variant: "default" },
  {
    id: "delete-counter",
    label: "Delete Counter",
    icon: Trash2,
    variant: "default",
  },

  // ✅ New CRM-related item
  {
    id: "crm-dashboard",
    label: "CRM Dashboard",
    icon: Users,
    variant: "default",
  },
] as const;

export function AdminSidebar({
  currentView,
  onViewChange,
  isMobileMenuOpen,
  onMobileMenuToggle,
}: AdminSidebarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Filter sidebar items based on user role
  const filteredSidebarItems =
    user?.role === "admin"
      ? sidebarItems
      : sidebarItems.filter(
          (item) =>
            item.id !== "add-counter" &&
            item.id !== "edit-profile" &&
            item.id !== "delete-counter"
        );

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border transition-all duration-200",
        isMobileMenuOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      )}
    >
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-gold flex items-center justify-center">
            <img
              src={logoImage}
              alt="Celebrity Wax Museum Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              Celebrity
            </h1>
            <p className="text-sm text-sidebar-foreground/70">Wax Museum</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {filteredSidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.id as DashboardView)}
                      className={cn(
                        "w-full justify-start px-4 py-3 rounded-lg transition-all duration-200",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive &&
                          "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          className="w-full justify-start bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
