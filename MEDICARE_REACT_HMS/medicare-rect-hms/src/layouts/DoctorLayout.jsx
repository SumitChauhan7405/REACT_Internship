import { Outlet } from "react-router-dom";

const DoctorLayout = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Outlet />
    </div>
  );
};

export default DoctorLayout;
