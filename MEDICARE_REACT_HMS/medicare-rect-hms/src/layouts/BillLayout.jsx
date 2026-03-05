import { Outlet } from "react-router-dom";
import BillSidebar from "../components/common/BillSidebar";
import BillNavbar from "../components/common/BillNavbar";
import "../assets/css/layout/layout.css";

const BillLayout = () => {
  return (
    <div className="admin-layout">
      <BillSidebar />

      <div className="admin-main">
        <BillNavbar />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BillLayout;