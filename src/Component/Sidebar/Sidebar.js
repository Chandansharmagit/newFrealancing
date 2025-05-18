import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Icons import - using react-icons
import { 
  FiHome, 
  FiMap, 
  FiCalendar, 
  FiHeart, 
  FiSettings, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiUsers, 
  FiUpload, 
  FiEdit, 
  FiBook, 
  FiMessageSquare 
} from 'react-icons/fi';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Handle clicks outside sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (!event.target.closest('.sidebar-toggle')) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      
      if (!isMobile && newIsMobile) {
        setIsOpen(false);
      } else if (isMobile && !newIsMobile && !isOpen) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isOpen]);

  // Menu items with updated icons
  const menuItems = [
    { 
      category: "Main",
      items: [
        { path: '/dashboard/dashboard', name: 'Dashboard', icon: <FiHome /> },
        { path: '/dashboard/teams-managements', name: 'Team Management', icon: <FiUsers /> } // Updated icon
      ]
    },
    {
      category: "Destinations",
      items: [
        { path: '/dashboard/upload-destination', name: 'Upload Destinations', icon: <FiUpload /> }, // Updated icon
        { path: '/dashboard/update-destinations', name: 'Update Destinations', icon: <FiEdit /> } // Updated icon
      ]
    },
    {
      category: "Tours",
      items: [
        { path: '/dashboard/Create-plan-tour', name: 'Upload Plan Tour', icon: <FiUpload /> }, // Updated icon
        { path: '/dashboard/Tour-page-dashboard', name: 'Manage Plan Tour', icon: <FiEdit /> } // Updated icon
      ]
    },
    {
      category: "Users",
      items: [
        { path: '/dashboard/Booking-data', name: 'Bookings', icon: <FiBook /> }, // Updated icon
        { path: '/dashboard/user-tracking', name: 'User Tracking', icon: <FiUser /> },
        { path: '/dashboard/Allusers', name: 'All Users', icon: <FiUsers /> }, // Updated icon
        { path: '/dashboard/users-feedback', name: 'Users Feedback', icon: <FiMessageSquare /> } // Updated icon
      ]
    },
    {
      category: "System",
      items: [
        { path: '/settings', name: 'Settings', icon: <FiSettings /> }
      ]
    }
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar} 
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
      >
        {isOpen && isMobile ? <FiX /> : 
         !isOpen ? <FiMenu /> : 
         <FiChevronLeft />}
      </button>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'open' : 'closed'}`}
        aria-hidden={!isOpen}
      >
        <div className="sidebar-header">
          {/* Logo instead of text */}
          {isOpen ? (
            <img src="/path/to/logo.png" alt="Travel App Logo" className="sidebar-logo" />
          ) : (
            <img src="/path/to/logo-icon.png" alt="Travel App Icon" className="sidebar-logo-collapsed" />
          )}
          {!isMobile && (
            <button 
              className="collapse-toggle" 
              onClick={toggleSidebar}
              aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
            </button>
          )}
        </div>
        
        <nav className="sidebar-menu" aria-label="Main Navigation">
          {menuItems.map((category, index) => (
            <div key={index} className="menu-category">
              {isOpen && <h3 className="category-title">{category.category}</h3>}
              <ul>
                {category.items.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={location.pathname === item.path ? 'active' : ''} 
                      onClick={closeSidebarOnMobile}
                      title={item.name}
                    >
                      <span className="icon">{item.icon}</span>
                      <span className="label">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <p>© 2025 Travel App</p>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;