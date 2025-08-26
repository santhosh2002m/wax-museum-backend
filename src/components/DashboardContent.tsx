import type { DashboardView } from "./AdminDashboard";
import { TodayDashboard } from "./views/TodayDashboard";
import { Last7DaysDashboard } from "./views/Last7DaysDashboard";
import { Last30DaysDashboard } from "./views/Last30DaysDashboard";
import { YearDashboard } from "./views/YearDashboard";
import { CalendarView } from "./views/CalendarView";
import { EditProfile } from "./views/EditProfile";
import { AddCounter } from "./views/AddCounter";
import { DeleteCounter } from "./views/DeleteCounter";
import { TicketDetails } from "./views/TicketDetails";
import { GuideScore } from "./views/GuideScore";

interface DashboardContentProps {
  currentView: DashboardView;
}

export function DashboardContent({ currentView }: DashboardContentProps) {
  switch (currentView) {
    case "today":
      return <TodayDashboard />;
    case "last-7-days":
      return <Last7DaysDashboard />;
    case "last-30-days":
      return <Last30DaysDashboard />;
    case "year":
      return <YearDashboard />;
    case "calendar-view":
      return <CalendarView />;
    case "edit-profile":
      return <EditProfile />;
    case "add-counter":
      return <AddCounter />;
    case "delete-counter":
      return <DeleteCounter />;
    case "ticket-details":
      return <TicketDetails />;
    case "guide-score":
      return <GuideScore />;
    default:
      return <TodayDashboard />;
  }
}
