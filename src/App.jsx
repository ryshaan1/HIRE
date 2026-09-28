import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";

import Home from "./components/pages/Home.jsx";
import Search from "./components/pages/Search.jsx";
import PropertyDetails from "./components/pages/PropertyDetails.jsx";
import Booking from "./components/pages/Booking.jsx";
import Compare from "./components/pages/Compare.jsx";
import Login from "./components/pages/Login.jsx";
import Signup from "./components/pages/Signup.jsx";
import RoleSelect from "./components/pages/RoleSelect.jsx";
import CriticDashboard from "./components/pages/CriticDashboard.jsx";
import ManagerDashboard from "./components/pages/ManagerDashboard.jsx";
import AdminDashboard from "./components/pages/AdminDashboard.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100 hire-app">
          <Navbar />
          <main className="flex-grow-1">
            <div className="container hire-container py-3">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/property/:id" element={<PropertyDetails />} />

                <Route
                  path="/booking/:id"
                  element={
                    <ProtectedRoute>
                      <Booking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/compare"
                  element={
                    <ProtectedRoute>
                      <Compare />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/critic"
                  element={
                    <ProtectedRoute allowedRoles={["critic"]}>
                      <CriticDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager"
                  element={
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/role-select" element={<RoleSelect />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
