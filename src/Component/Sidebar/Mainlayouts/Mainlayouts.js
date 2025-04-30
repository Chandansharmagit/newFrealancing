// Mainlayouts/Mainlayouts.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function MainLayout() {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", minHeight: "100vh", background: "#fff" }}>
        <Sidebar />
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
