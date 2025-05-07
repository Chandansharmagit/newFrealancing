import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Component/homePage/Homepage";
import { useState, useEffect } from "react";
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

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track auth state

  // Function to check authentication by calling the backend
  const checkAuth = async () => {
    try {
      const response = await fetch("https://authenticationagency.onrender.com/api/check-auth", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });
      const data = await response.json();
      console.log("Auth check response:", data);
      setIsAuthenticated(data.isAuthenticated);
      if (data.isAuthenticated) {
        setIsLoginOpen(false); // Close popup if authenticated
      } else if (!isLoginOpen) {
        setIsLoginOpen(true); // Open popup if not authenticated
      }
    } catch (error) {
      console.error("Error checking auth:", error.message);
      setIsAuthenticated(false);
      if (!isLoginOpen) {
        setIsLoginOpen(true);
      }
    }
  };

  useEffect(() => {
    // Initial check for authentication
    checkAuth();

    // Set timer to show popup if not authenticated after 8 seconds
    const timer = setTimeout(() => {
      if (isAuthenticated === false) {
        setIsLoginOpen(true);
      }
    }, 8000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  // Optional: Poll the backend periodically (if needed)
  useEffect(() => {
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const openLoginPopup = () => {
    setIsLoginOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginOpen(false);
  };

  return (
    <BrowserRouter>
      <Navbar openLoginPopup={openLoginPopup} />
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
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/destinations" element={<ViewAllDestinations />} />
        <Route path="/tours" element={<ViewAllTours />} />
        <Route path="/AboutUs-page.html" element={<AboutUs />} />
        <Route path="/Experiencepage.html" element={<Experiences />} />
        <Route path="/contact-form" element={<ContactForm />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/u" element={<Allusers />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route path="upload-destination" element={<DestinationUpload />} />
          <Route
            path="update-destinations"
            element={<MainUploadingDestination />}
          />
          <Route path="Tour-page-dashboard" element={<TourDashboardPage />} />
          <Route path="Allusers" element={<Allusers />} />
          <Route path="Create-plan-tour" element={<CreateTourPage />} />
          <Route path="user-tracking" element={<TrackingDashboard />} />
          <Route path="Booking-data" element={<BookingDashboard />} />
          <Route path="users-feedback" element={<FeedbackDashboard />} />
        </Route>
      </Routes>
      <Footer />
      <LoginPopup isOpen={isLoginOpen} onClose={closeLoginPopup} />
      <CookieBanner />
      <ChatBox />
      <FeedbackPopup />
    </BrowserRouter>
  );
}

export default App;