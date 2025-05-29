import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { 
  FiHome, 
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
        if (!event.target.closest('.sb-sidebar-toggle')) {
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
         { path: '/dashboard/google-analytics-realtime-traffic', name: 'Traffics Management', icon: <FiHome /> },
        { path: '/dashboard/dashboard', name: 'Users Query', icon: <FiHome /> },
        { path: '/dashboard/teams-managements', name: 'Team Management', icon: <FiUsers /> }
      ]
    },
    {
      category: "Destinations",
      items: [
        { path: '/dashboard/upload-destination', name: 'Upload Destinations', icon: <FiUpload /> },
        { path: '/dashboard/update-destinations', name: 'Update Destinations', icon: <FiEdit /> }
      ]
    },
    {
      category: "Tours",
      items: [
        { path: '/dashboard/Create-plan-tour', name: 'Upload Plan Tour', icon: <FiUpload /> },
        { path: '/dashboard/Tour-page-dashboard', name: 'Manage Plan Tour', icon: <FiEdit /> }
      ]
    },
    {
      category: "Users",
      items: [
        { path: '/dashboard/Booking-data', name: 'Bookings', icon: <FiBook /> },
        { path: '/dashboard/user-tracking', name: 'User Tracking', icon: <FiUser /> },
        { path: '/dashboard/Allusers', name: 'All Users', icon: <FiUsers /> },
        { path: '/dashboard/users-feedback', name: 'Users Feedback', icon: <FiMessageSquare /> }
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
        className="sb-sidebar-toggle" 
        onClick={toggleSidebar} 
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
        data-testid="sidebar-toggle"
      >
        {isOpen && isMobile ? <FiX /> : 
         !isOpen ? <FiMenu /> : 
         <FiChevronLeft />}
      </button>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`sb-sidebar ${isOpen ? 'sb-open' : 'sb-closed'}`}
        aria-hidden={!isOpen}
        data-testid="sidebar"
      >
        <div className="sb-sidebar-header">
          {isOpen ? (
            <img 
              src="/path/to/logo.png" 
              alt="Travel App Logo" 
              className="sb-sidebar-logo" 
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Logo')} 
            />
          ) : (
            <img 
              src="/path/to/logo-icon.png" 
              alt="Travel App Icon" 
              className="sb-sidebar-logo-collapsed" 
              onError={(e) => (e.target.src = 'https://via.placeholder.com/40?text=Icon')} 
            />
          )}
          {!isMobile && (
            <button 
              className="sb-collapse-toggle" 
              onClick={toggleSidebar}
              aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
            </button>
          )}
        </div>
        
        <nav className="sb-sidebar-menu" aria-label="Main Navigation">
          {menuItems.map((category, index) => (
            <div key={index} className="sb-menu-category">
              {isOpen && <h3 className="sb-category-title">{category.category}</h3>}
              <ul>
                {category.items.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={location.pathname === item.path ? 'sb-active' : ''} 
                      onClick={closeSidebarOnMobile}
                      title={item.name}
                    >
                      <span className="sb-icon">{item.icon}</span>
                      <span className="sb-label">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        
        <div className="sb-sidebar-footer">
          <p>© 2025 Travel App</p>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="sb-sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;