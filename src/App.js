import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Component/homePage/Homepage";
import { useState, useEffect } from "react";
import Navbar from "./Component/Navbar/Navbar";
import LoginPage from "./Component/Authentications/Login";
import RegisterPage from "./Component/Authentications/RegisterPage";
import TravelDestinations from "./Component/destinations/Destinations";
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
import TopHeader from "./Component/Navbar/TopHeader";
import BookingDashboard from "./DynamicBookings/DashboardBooking/DashboardBooking";

// Utility function to get a cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    // Check for the specific JWT cookie
    const token = getCookie("jwt_token_for_traveling_website_ChandanSharma");

    // If the token is NOT present, show the login popup after 8 seconds
    if (!token) {
      const timer = setTimeout(() => {
        setIsLoginOpen(true);
      }, 8000); // 8 seconds

      // Cleanup the timer when component unmounts
      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array to run only once on mount

  const openLoginPopup = () => {
    setIsLoginOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginOpen(false);
  };

  return (
    <BrowserRouter>
     
      <Navbar openLoginPopup={openLoginPopup} />
      <TopHeader />
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
        <Route path="/des" element={<TravelDestinations />} />
        <Route path="/contact-form" element={<ContactForm />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/u" element={<Allusers />} />

        {/* 🧩 Wrap upload-destination with MainLayout */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route path="upload-destination" element={<DestinationUpload />} />
          <Route
            path="update-destinations"
            element={<MainUploadingDestination />}
          />
          <Route path="Allusers" element={<Allusers />} />
          <Route path="Create-plan-tour" element={<CreateTourPage />} />
          <Route path="user-tracking" element={<TrackingDashboard />} />
          <Route path="Booking-data" element={<BookingDashboard />} />
        </Route>
      </Routes>

      <LoginPopup isOpen={isLoginOpen} onClose={closeLoginPopup} />
      <CookieBanner />
      <ChatBox />
    </BrowserRouter>
  );
}

export default App;
