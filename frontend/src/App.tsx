import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

function App() {
  const user = getUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login
                switchToRegister={() => window.location.replace("/register")}
                switchToForgotPassword={() => window.location.replace("/forgot-password")}
              />
            )
          }
        />

        <Route
          path="/register"
          element={<Register switchToLogin={() => window.location.replace("/")} />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword switchToLogin={() => window.location.replace("/")} />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/admin"
          element={
            user && user.role === "ADMIN" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;