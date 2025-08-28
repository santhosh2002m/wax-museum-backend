import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "../components/ui/use-toast";

interface User {
  username: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser({
          username: data.username,
          role: data.role,
          createdAt: data.createdAt,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: data.username,
            role: data.role,
            createdAt: data.createdAt,
          })
        );

        toast({
          title: "Login successful",
          description: `Welcome back, ${data.username}!`,
        });

        return true;
      } else {
        const error = await response.json();
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear any cookies
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    // Navigate to login page
    window.location.href = "/";
  };

  const updateProfile = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Profile updated",
          description: "Your password has been updated successfully.",
        });
        return true;
      } else {
        const error = await response.json();
        toast({
          title: "Update failed",
          description: error.message || "Failed to update profile",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Update error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/counters/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Password changed",
          description: "Your password has been changed successfully.",
        });
        return true;
      } else {
        const error = await response.json();
        toast({
          title: "Password change failed",
          description: error.message || "Failed to change password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Password change error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateProfile,
    changePassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
