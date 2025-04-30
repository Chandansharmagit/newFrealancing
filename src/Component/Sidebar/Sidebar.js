import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Icons import - assuming you're using react-icons
import { FiHome, FiMap, FiCalendar, FiHeart, FiSettings, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on first render

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <FiHome /> },
    { path: '/dashboard/upload-destination', name: 'upload destinations', icon: <FiMap /> },
    { path: '/dashboard/update-destinations', name: 'update destinations', icon: <FiMap /> },
    { path: '/dashboard/Booking-data', name: 'Bookings', icon: <FiCalendar /> },
    { path: '/dashboard/user-tracking', name: 'user tracking', icon: <FiMap /> },
    { path: '/dashboard/Create-plan-tour', name: 'Upload Plan Tour', icon: <FiHeart /> },
    { path: '/dashboard/Allusers', name: 'Profile', icon: <FiUser /> },
    { path: '/settings', name: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Menu">
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Travel App</h2>
        </div>
        
        <nav className="sidebar-menu">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''} 
                  onClick={closeSidebarOnMobile}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <p>© 2025 Travel App</p>
        </div>
      </div>
      
      {/* Overlay to close sidebar when clicking outside on mobile */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar; 