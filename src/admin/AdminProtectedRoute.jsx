import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch("https://aims-academy-backend-production-a580.up.railway.app/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminLoggedIn");
          localStorage.removeItem("adminInfo");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isAuthenticated === null) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;