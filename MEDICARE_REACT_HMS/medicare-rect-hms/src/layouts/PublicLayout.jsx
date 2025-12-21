import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      {/* Public pages like Home, Doctors, Login */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
