import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
