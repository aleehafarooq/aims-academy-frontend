import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import News from "./pages/News";
import Contact from "./pages/Contact";
import NewsDetails from "./pages/NewsDetails";

import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import Students from "./admin/Students";
import Attendance from "./admin/Attendance";
import Fees from "./admin/Fees";
import FeeVouchers from "./admin/FeeVouchers";
import Results from "./admin/Results";
import AdminCourses from "./admin/Courses";
import NewsManagement from "./admin/NewsManagement";
import Reports from "./admin/Reports";
import Settings from "./admin/Settings";

function AppContent() {
  const location = useLocation();

  const isAdminPage =
    location.pathname.startsWith("/admin");

  return (
    <>
      {/* =================================
          PUBLIC NAVBAR
      ================================= */}

      {!isAdminPage && <Navbar />}

      <Routes>

        {/* =================================
            PUBLIC WEBSITE
        ================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/news"
          element={<News />}
        />

        <Route
          path="/news/:id"
          element={<NewsDetails />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* =================================
            ADMIN LOGIN
            This route is NOT protected.
        ================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =================================
            PROTECTED ADMIN PORTAL
        ================================= */}

        <Route element={<AdminProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* =================================
                /admin
            ================================= */}

            <Route
              index
              element={<AdminDashboard />}
            />


            {/* =================================
                /admin/dashboard
            ================================= */}

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />


            {/* =================================
                /admin/students
            ================================= */}

            <Route
              path="students"
              element={<Students />}
            />


            {/* =================================
                /admin/attendance
            ================================= */}

            <Route
              path="attendance"
              element={<Attendance />}
            />


            {/* =================================
                /admin/fees
            ================================= */}

            <Route
              path="fees"
              element={<Fees />}
            />


            {/* =================================
                /admin/fee-vouchers
            ================================= */}

            <Route
              path="fee-vouchers"
              element={<FeeVouchers />}
            />


            {/* =================================
                /admin/results
            ================================= */}

            <Route
              path="results"
              element={<Results />}
            />


            {/* =================================
                /admin/courses
            ================================= */}

            <Route
              path="courses"
              element={<AdminCourses />}
            />


            {/* =================================
                /admin/news
            ================================= */}

            <Route
              path="news"
              element={<NewsManagement />}
            />


            {/* =================================
                /admin/reports
            ================================= */}

            <Route
              path="reports"
              element={<Reports />}
            />


            {/* =================================
                /admin/settings
            ================================= */}

            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>

        </Route>

      </Routes>


      {/* =================================
          PUBLIC FOOTER
      ================================= */}

      {!isAdminPage && <Footer />}
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
