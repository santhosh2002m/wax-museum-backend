import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "../components/ui/use-toast";

interface Counter {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  id: number;
  price: number;
  ticket_type: string;
  show_name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface Guide {
  id: number;
  name: string;
  number: string;
  vehicle_type: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsData {
  totalTickets: number;
  totalAmount: string;
  [key: string]: any;
}

interface Transaction {
  id: number; // Added to match backend
  sNo: number;
  invoiceNo: string;
  date: string;
  showName: string;
  category: string;
  counter: string;
  adult: number;
  child: number;
  totalPaid: string;
}

interface CalendarData {
  totalSales: number;
  totalAmount: string;
  transactions: Transaction[];
}

interface DataContextType {
  // Counters
  counters: Counter[];
  fetchCounters: () => Promise<void>;
  registerCounter: (
    username: string,
    password: string,
    role?: string
  ) => Promise<boolean>;
  deleteCounter: (id: number) => Promise<boolean>;
  changeCounterPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;

  // Tickets
  tickets: Ticket[];
  fetchTickets: () => Promise<void>;
  addTicket: (
    ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updateTicket: (id: number, ticket: Partial<Ticket>) => Promise<boolean>;
  deleteTicket: (id: number) => Promise<boolean>;

  // Guides
  guides: Guide[];
  fetchGuides: () => Promise<void>;
  addGuide: (
    guide: Omit<Guide, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updateGuide: (id: number, guide: Partial<Guide>) => Promise<boolean>;
  deleteGuide: (id: number) => Promise<boolean>;

  // Analytics
  fetchTodayAnalytics: () => Promise<AnalyticsData | null>;
  fetchLast7DaysAnalytics: () => Promise<AnalyticsData | null>;
  fetchLast30DaysAnalytics: () => Promise<AnalyticsData | null>;
  fetchAnnualAnalytics: () => Promise<AnalyticsData | null>;
  fetchCalendarData: (
    start: string,
    end: string
  ) => Promise<CalendarData | null>;

  // Transactions
  updateTransaction: (
    id: number,
    transaction: Partial<Transaction>
  ) => Promise<boolean>;
  deleteTransaction: (id: number) => Promise<boolean>;

  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const makeRequest = async (url: string, options: RequestInit = {}) => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to perform this action",
        variant: "destructive",
      });
      throw new Error("No authentication token");
    }

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${url}`,
      defaultOptions
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  };

  // Counters functions
  const fetchCounters = async () => {
    setLoading(true);
    try {
      const data = await makeRequest("/api/counters");
      setCounters(data);
    } catch (error: any) {
      toast({
        title: "Failed to fetch counters",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const registerCounter = async (
    username: string,
    password: string,
    role?: string
  ): Promise<boolean> => {
    try {
      const body: any = { username, password };
      if (role) body.role = role;

      await makeRequest("/api/counters/register", {
        method: "POST",
        body: JSON.stringify(body),
      });

      toast({
        title: "Counter created",
        description: `Counter ${username} has been created successfully`,
      });

      await fetchCounters();
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to create counter",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCounter = async (id: number): Promise<boolean> => {
    try {
      await makeRequest(`/api/counters/${id}`, {
        method: "DELETE",
      });

      toast({
        title: "Counter deleted",
        description: "Counter has been deleted successfully",
      });

      await fetchCounters();
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to delete counter",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const changeCounterPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      await makeRequest("/api/counters/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      toast({
        title: "Password changed",
        description: "Password has been changed successfully",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Failed to change password",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Tickets functions
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await makeRequest("/api/tickets");
      setTickets(data);
    } catch (error: any) {
      toast({
        title: "Failed to fetch tickets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTicket = async (
    ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">
  ): Promise<boolean> => {
    try {
      await makeRequest("/api/tickets", {
        method: "POST",
        body: JSON.stringify(ticket),
      });

      toast({
        title: "Ticket added",
        description: "Ticket has been added successfully",
      });

      await fetchTickets();
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to add ticket",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateTicket = async (
    id: number,
    ticket: Partial<Ticket>
  ): Promise<boolean> => {
    try {
      await makeRequest(`/api/tickets/${id}`, {
        method: "PUT",
        body: JSON.stringify(ticket),
      });

      toast({
        title: "Ticket updated",
        description: "Ticket has been updated successfully",
      });

      await fetchTickets();
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to update ticket",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTicket = async (id: number): Promise<boolean> => {
    try {
      await makeRequest(`/api/tickets/${id}`, {
        method: "DELETE",
      });

      toast({
        title: "Ticket deleted",
        description: "Ticket has been deleted successfully",
      });

      await fetchTickets();
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to delete ticket",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Guides functions
  const fetchGuides = async () => {
    setLoading(true);
    try {
      const data = await makeRequest("/api/guides");
      setGuides(data);
    } catch (error: any) {
      toast({
        title: "Failed to fetch guides",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addGuide = async (
    guide: Omit<Guide, "id" | "createdAt" | "updatedAt">
  ): Promise<boolean> => {
    try {
      await makeRequest("/api/guides", {
        method: "POST",
        body: JSON.stringify(guide),
      });

      toast({
        title: "Guide added",
        description: "Guide has been added successfully",
      });

      await fetchGuides();
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to add guide",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateGuide = async (
    id: number,
    guide: Partial<Guide>
  ): Promise<boolean> => {
    try {
      await makeRequest(`/api/guides/${id}`, {
        method: "PUT",
        body: JSON.stringify(guide),
      });

      toast({
        title: "Guide updated",
        description: "Guide has been updated successfully",
      });

      await fetchGuides();
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to update guide",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteGuide = async (id: number): Promise<boolean> => {
    try {
      await makeRequest(`/api/guides/${id}`, {
        method: "DELETE",
      });

      toast({
        title: "Guide deleted",
        description: "Guide has been deleted successfully",
      });

      await fetchGuides();
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to delete guide",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Analytics functions
  const fetchTodayAnalytics = async (): Promise<AnalyticsData | null> => {
    try {
      return await makeRequest("/api/analytics/today");
    } catch (error: any) {
      toast({
        title: "Failed to fetch today's analytics",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const fetchLast7DaysAnalytics = async (): Promise<AnalyticsData | null> => {
    try {
      return await makeRequest("/api/analytics/last7days");
    } catch (error: any) {
      toast({
        title: "Failed to fetch last 7 days analytics",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const fetchLast30DaysAnalytics = async (): Promise<AnalyticsData | null> => {
    try {
      return await makeRequest("/api/analytics/last30days");
    } catch (error: any) {
      toast({
        title: "Failed to fetch last 30 days analytics",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const fetchAnnualAnalytics = async (): Promise<AnalyticsData | null> => {
    try {
      return await makeRequest("/api/analytics/annual");
    } catch (error: any) {
      toast({
        title: "Failed to fetch annual analytics",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const fetchCalendarData = async (
    start: string,
    end: string
  ): Promise<CalendarData | null> => {
    try {
      return await makeRequest(
        `/api/analytics/calendar?start=${start}&end=${end}`
      );
    } catch (error: any) {
      toast({
        title: "Failed to fetch calendar data",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTransaction = async (
    id: number,
    transaction: Partial<Transaction>
  ): Promise<boolean> => {
    try {
      await makeRequest(`/api/analytics/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify(transaction),
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to update transaction",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTransaction = async (id: number): Promise<boolean> => {
    try {
      await makeRequest(`/api/analytics/transactions/${id}`, {
        method: "DELETE",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to delete transaction",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const value = {
    counters,
    fetchCounters,
    registerCounter,
    deleteCounter,
    changeCounterPassword,
    tickets,
    fetchTickets,
    addTicket,
    updateTicket,
    deleteTicket,
    guides,
    fetchGuides,
    addGuide,
    updateGuide,
    deleteGuide,
    fetchTodayAnalytics,
    fetchLast7DaysAnalytics,
    fetchLast30DaysAnalytics,
    fetchAnnualAnalytics,
    fetchCalendarData,
    updateTransaction,
    deleteTransaction,
    loading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
