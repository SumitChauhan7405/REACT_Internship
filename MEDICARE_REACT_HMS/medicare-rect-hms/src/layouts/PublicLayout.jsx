import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      {/* Public navbar can be added later */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
