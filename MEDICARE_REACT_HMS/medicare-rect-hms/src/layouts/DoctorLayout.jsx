import { Outlet } from "react-router-dom";
import DoctorSidebar from "../components/common/DoctorSidebar";
import DoctorNavbar from "../components/common/DoctorNavbar";

const DoctorLayout = () => {
  return (
    <div className="admin-layout">
      <DoctorSidebar />

      <div className="admin-main">
        <DoctorNavbar />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;
