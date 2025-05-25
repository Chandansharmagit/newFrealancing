import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import HomePage from "./Component/homePage/Homepage";
import Navbar from "./Component/Navbar/Navbar";
import LoginPage from "./Component/Authentications/Login";
import RegisterPage from "./Component/Authentications/RegisterPage";
import ContactForm from "./Component/contactForm/ContactForms";
import CookiePolicy from "./Component/userIpAdress/CookiePolicy";
import CookieBanner from "./Component/userIpAdress/CookieBanner";
import LoginPopup from "./Component/Authentications/LoginPopup";
import UserProfile from "./Component/Authentications/userprofile/Userprofile";
import ChatBox from "./chatbot/ChatBox";
import { ForgotPasswordPage } from "./Component/Authentications/Forgotpassword";
import DestinationUpload from "./DashboardComponent/DestinatonUpload";
import DestinationDetails from "./Component/homePage/DestinationsDetails/DestinatonsDetails";
import ViewAllDestinations from "./Component/homePage/ViewallDestinations/ViewAllDestinations";
import Sidebar from "./Component/Sidebar/Sidebar";
import MainLayout from "./Component/Sidebar/Mainlayouts/Mainlayouts";
import MainUploadingDestination from "./DynamicDestination/MainUplodingDestination";
import Allusers from "./DynamicDestination/Users/Allusers";
import { ResetPasswordPage } from "./Component/Authentications/ResetPasswordPage";
import CreateTourPage from "./toursComponent/DynamicTour/CreateTourPage";
import TourDetailPage from "./toursComponent/TourDetailPage";
import TrackingDashboard from "./DynamicBookings/TrackingDashboard";
import BookingDashboard from "./DynamicBookings/DashboardBooking/DashboardBooking";
import ViewAllTours from "./Component/homePage/DestinationsDetails/Viewalltours/ViewAlltours";
import AboutUs from "./Component/AboutUs/Aboutus";
import Experiences from "./Component/AboutUs/Experience";
import TourDashboardPage from "./toursComponent/DynamicTour/dashboardUpdatingDeletions/Updationstourpage";
import FeedbackPopup from "./Feedback.js/Feedback";
import FeedbackDashboard from "./Feedback.js/Feedbackdashboard/Feedbackdashboard";
import Footer from "./Component/homePage/Footer";
import SearchQuery from "./searchquery/SearchQuery";
import Dashboard from "./Component/contactForm/Dashboards/Dashboard";
import LoginDashboardAuth from "./DashboardLinks/LoginDashboardAuth";
import TeamDashboard from "./Component/AboutUs/Teamdashboard/TeamDashboard";
import NotFound from "./PageNotFound/PageNotfound";

function PrivateRoute({ children, isAuthenticated, setShowAuthPopup }) {
  if (!isAuthenticated) {
    setShowAuthPopup(true); // Instantly show the auth popup
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [isDashboardAuthOpen, setIsDashboardAuthOpen] = useState(false);
  const [isDashboardAuthenticated, setIsDashboardAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Added to track current route

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(
        "https://authenticationagency.onrender.com/api/check-auth",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log("Auth check response:", data);
      setIsAuthenticated(data.isAuthenticated);
      if (data.isAuthenticated) {
        setIsLoginOpen(false);
      }
    } catch (error) {
      console.error("Error checking auth:", error.message);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const timer = setTimeout(() => {
      if (isAuthenticated === false && !hasShownPopup) {
        setIsLoginOpen(true);
        setHasShownPopup(true);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasShownPopup, checkAuth]);

  useEffect(() => {
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  const openLoginPopup = () => {
    setIsLoginOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginOpen(false);
    setHasShownPopup(true);
  };

  const handleDashboardAuth = (isSuccess) => {
    setIsDashboardAuthenticated(isSuccess);
    setIsDashboardAuthOpen(!isSuccess);
    if (isSuccess) {
      navigate("/dashboard/dashboard");
    }
  };

  const closeDashboardAuth = () => {
    setIsDashboardAuthOpen(false);
  };

  // Check if the current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardRoute && <Navbar openLoginPopup={openLoginPopup} />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tour/:id" element={<TourDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/register" element={<RegisterPage />} />
        <Route
          path="/login/register/forgot-password"
          element={<ForgotPasswordPage />}
        />
        <Route
          path="/login/register/forgot-password/Change-password"
          element={<ResetPasswordPage />}
        />
        <Route path="/search" element={<SearchQuery />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/destinations" element={<ViewAllDestinations />} />
        <Route path="/tours" element={<ViewAllTours />} />
        <Route path="/AboutUs-page" element={<AboutUs />} />
        <Route path="/Experiencepage" element={<Experiences />} />
        <Route path="/contact-form" element={<ContactForm />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/u" element={<Allusers />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute
              isAuthenticated={isDashboardAuthenticated}
              setShowAuthPopup={setIsDashboardAuthOpen}
            >
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="upload-destination" element={<DestinationUpload />} />
          <Route
            path="update-destinations"
            element={<MainUploadingDestination />}
          />
          <Route path="Tour-page-dashboard" element={<TourDashboardPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="Allusers" element={<Allusers />} />
          <Route path="teams-managements" element={<TeamDashboard />} />
          <Route path="Create-plan-tour" element={<CreateTourPage />} />
          <Route path="user-tracking" element={<TrackingDashboard />} />
          <Route path="Booking-data" element={<BookingDashboard />} />
          <Route path="users-feedback" element={<FeedbackDashboard />} />
        </Route>
      </Routes>

      {!isDashboardRoute && <Footer />}
      <LoginPopup isOpen={isLoginOpen} onClose={closeLoginPopup} />
      <LoginDashboardAuth
        isOpen={isDashboardAuthOpen}
        onClose={closeDashboardAuth}
        onAuthenticate={handleDashboardAuth}
      />
      <CookieBanner />
      <ChatBox />
      <FeedbackPopup />
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