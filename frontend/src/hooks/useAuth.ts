import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api-client";

export interface User {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: "user" | "admin" | "super_admin";
  email_verified: boolean;
  is_active: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get("auth_token");

    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await apiClient.getCurrentUser();
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      Cookies.remove("auth_token");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    const { access_token, user: userData } = response.data.data;

    Cookies.set("auth_token", access_token, { expires: 7 }); // 7 days
    setUser(userData);
    setIsAuthenticated(true);

    return userData;
  };

  const register = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    const response = await apiClient.register(data);
    const { access_token, user: userData } = response.data.data;

    Cookies.set("auth_token", access_token, { expires: 7 });
    setUser(userData);
    setIsAuthenticated(true);

    return userData;
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("auth_token");
      setUser(null);
      setIsAuthenticated(false);
      router.push("/auth/login");
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
}
