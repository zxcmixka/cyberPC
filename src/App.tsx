import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/UserList";
import UserClientPage from "./pages/UserClientPage";
import Auth from "./components/Auth";

function AdminRoute({ children }: { children: JSX.Element }) {
  const role = localStorage.getItem("cybershell_role");
  if (role !== "ADMIN") {
    return <Navigate to="/client" replace />;
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

    const isAdmin = ["admin", "operator"].includes(user.username.toLowerCase());
    localStorage.setItem("cybershell_role", isAdmin ? "ADMIN" : "USER");

    window.location.href = isAdmin ? "/" : "/client";
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={<Auth onAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/"
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
        </Route>
        <Route
          path="/client"
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
