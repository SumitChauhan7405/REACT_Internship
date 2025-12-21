// 🔹 PUBLIC LAYOUT
// 🔹 NO SIDEBAR, NO NAVBAR

import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default PublicLayout;
