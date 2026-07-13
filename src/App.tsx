import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/UserList";
import UserClientPage from "./pages/UserClientPage";
import Auth from "./components/Auth";
import AdminPage from "./pages/AdminPanel"; // 1. ИМПОРТИРУЕМ СТРАНИЦУ АДМИН-ПАНЕЛИ

function AdminRoute({ children }: { children: JSX.Element }) {
  const role = localStorage.getItem("cybershell_user_role");
  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem("cybershell_user");
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  const handleAuthSuccess = (user: any) => {
    localStorage.setItem("cybershell_user", user.username);
    localStorage.setItem("cybershell_user_id", user.id || user._id || "");

    const isAdmin = ["admin", "operator", "admin_root"].includes(
      user.username.toLowerCase(),
    );
    localStorage.setItem("cybershell_role", isAdmin ? "ADMIN" : "USER");
    localStorage.setItem("cybershell_user_role", isAdmin ? "ADMIN" : "USER");

    window.location.href = isAdmin ? "/admin/panel" : "/";
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={<Auth onAuthSuccess={handleAuthSuccess} />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout />
              </AdminRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="panel" element={<AdminPage />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserClientPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
