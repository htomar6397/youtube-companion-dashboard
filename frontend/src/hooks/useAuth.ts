import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001/api";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    fetch(`${API_BASE}/auth/status`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setIsAuthenticated(!!data?.authenticated);
        setLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  // Handle Google login
  const handleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(false);
        // Optionally reload the page to clear any cached data
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    isAuthenticated,
    loading,
    handleLogin,
    handleLogout,
  };
};
