import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/Home";
import Register from "./pages/Register";
import UserLogin from "./pages/UserLogin";

/* ================= USER PAGES ================= */
import UserLayout from "./pages/UserLayout";
import UserDashboard from "./pages/UserDashboard";
import SearchParking from "./pages/SearchParking";
import BookingHistory from "./pages/BookingHistory";
import UserProfile from "./pages/UserProfile";
import BookParking from "./pages/BookParking";   // ✅ BOOK PAGE
import Payment from "./pages/Payment";           // ✅ PAYMENT PAGE

/* ================= ADMIN PAGES ================= */
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ManageParking from "./pages/ManageParking";
import EditParking from "./pages/EditParking";
import AdminProfile from "./pages/AdminProfile";
import Reservations from "./pages/Reservations";
import Users from "./pages/Users";

/* ================= CONTEXT ================= */
import { AdminStatsProvider } from "./context/AdminStatsContext";

/* ================= ROUTE GUARDS ================= */
const UserProtected = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/user-login" />;
};

const AdminProtected = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role === "admin" ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ============ PUBLIC ROUTES ============ */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/login" element={<UserLogin />} />

        {/* ============ USER ROUTES ============ */}
        <Route
          path="/user"
          element={
            <UserProtected>
              <UserLayout />
            </UserProtected>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="search" element={<SearchParking />} />
          <Route path="book/:id" element={<BookParking />} />     {/* ✅ */}
          <Route path="payment" element={<Payment />} />          {/* ✅ */}
          <Route path="bookings" element={<BookingHistory />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* ============ ADMIN LOGIN ============ */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ============ ADMIN ROUTES ============ */}
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <AdminStatsProvider>
                <AdminLayout />
              </AdminStatsProvider>
            </AdminProtected>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manage-parking" element={<ManageParking />} />
          <Route path="edit-parking/:id" element={<EditParking />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* ============ FALLBACK ============ */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
