import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import BookParking from "./pages/BookParking";
import Payment from "./pages/Payment";

/* ================= ADMIN PAGES ================= */
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ManageParking from "./pages/ManageParking";
import EditParking from "./pages/EditParking";
import AdminProfile from "./pages/AdminProfile";
import AdminReservations from "./pages/AdminReservations";
import Users from "./pages/Users";

/* ================= CONTEXT ================= */
import { AdminStatsProvider } from "./context/AdminStatsContext";

/* ================= CHATBOT ================= */
import ChatBot from "./components/ChatBot";

/* ================= ROUTE GUARDS ================= */

const UserProtected = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/user-login" />;
};

const AdminProtected = ({ children }) => {
  let user = null;

  try {
    const rawUser = localStorage.getItem("user");

    if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
      user = JSON.parse(rawUser);
    }
  } catch (err) {
    console.warn("⚠️ Invalid admin user in localStorage");
  }

  return user?.role === "admin"
    ? children
    : <Navigate to="/admin-login" />;
};

/* ================= CHATBOT WRAPPER ================= */

// 🔥 Hide chatbot on login pages (better UX)
const ChatBotWrapper = () => {
  const location = useLocation();

  const hideOnPaths = ["/user-login", "/login", "/admin-login"];

  if (hideOnPaths.includes(location.pathname)) return null;

  return <ChatBot />;
};

/* ================= MAIN APP ================= */

function App() {
  return (
    <BrowserRouter>

      {/* ================= ROUTES ================= */}
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
          <Route path="book/:id" element={<BookParking />} />
          <Route path="payment" element={<Payment />} />
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
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* ============ FALLBACK ============ */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      {/* ================= CHATBOT GLOBAL ================= */}
      <ChatBotWrapper />

    </BrowserRouter>
  );
}

export default App;