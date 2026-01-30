import { Outlet } from "react-router-dom";
import LabSidebar from "../components/common/LabSidebar";
import LabNavbar from "../components/common/LabNavbar";
import "../assets/css/layout/layout.css";

const LabLayout = () => {
  return (
    <div className="admin-layout">
      <LabSidebar />

      <div className="admin-main">
        <LabNavbar />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LabLayout;
