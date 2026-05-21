import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import GlobalLoader from "./components/GlobalLoader";

// Lazy-loaded Public Pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Donation = lazy(() => import("./pages/Donation"));
const Events = lazy(() => import("./pages/Events"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const Vision = lazy(() => import("./pages/Vision"));
const History = lazy(() => import("./pages/History"));
const Contact = lazy(() => import("./pages/Contact"));
const Volunteer = lazy(() => import("./pages/Volunteer"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const StoryDetail = lazy(() => import("./pages/StoryDetail"));

// New compatible views
const ImpactReports = lazy(() => import("./pages/ImpactReports"));
const MediaGallery = lazy(() => import("./pages/MediaGallery"));
const FaqAccordion = lazy(() => import("./pages/FaqAccordion"));
const FinancialTransparency = lazy(() => import("./pages/FinancialTransparency"));

// Dashboards (Lazy)
const AdminDashboard = lazy(() => import("./admin/Dashboard"));
const UserDashboard = lazy(() => import("./pages/dashboards/UserDashboard"));
const VolunteerDashboard = lazy(() => import("./pages/dashboards/VolunteerDashboard"));

// Context & protection
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./utils/permissions";

// MUI Theme Integration
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

// Create custom theme using the Tailwind config brand colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#B07A3F", // primary golden-brown
    },
    secondary: {
      main: "#F59E0B", // warm orange accent
    },
    background: {
      default: "#fafafa",
    }
  },
  typography: {
    fontFamily: '"Inter", "sans-serif"',
    h1: { fontFamily: '"Poppins", "sans-serif"' },
    h2: { fontFamily: '"Poppins", "sans-serif"' },
    h3: { fontFamily: '"Poppins", "sans-serif"' },
    h4: { fontFamily: '"Poppins", "sans-serif"' },
    h5: { fontFamily: '"Poppins", "sans-serif"' },
    h6: { fontFamily: '"Poppins", "sans-serif"' },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<GlobalLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/history" element={<History />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/volunteer" element={<Volunteer />} />

          {/* New public pages */}
          <Route path="/reports" element={<ImpactReports />} />
          <Route path="/gallery" element={<MediaGallery />} />
          <Route path="/faq" element={<FaqAccordion />} />
          <Route path="/transparency" element={<FinancialTransparency />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected: donation (any authenticated user) */}
          <Route
            path="/donation"
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
                <Donation />
              </ProtectedRoute>
            }
          />

          {/* Role-specific dashboards */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/volunteer"
            element={
              <ProtectedRoute allowedRoles={[ROLES.VOLUNTEER]}>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
