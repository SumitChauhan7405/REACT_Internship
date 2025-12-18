import adminimg from "../../assets/images/users/admin.jpg";
import flagimg from "../../assets/images/users/us.png";
const Navbar = () => {
  return (
    <header className="navbar-emr">
      {/* LEFT SECTION */}
      <div className="navbar-left">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search patients, appointments..."
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="navbar-right">
        {/* Country / Language */}
        <div className="navbar-country">
          <img
            src={flagimg}
            alt="India"
          />
        </div>

        {/* Notifications */}
        <button className="nav-icon-btn">
          <i className="bi bi-bell"></i>
        </button>

        {/* User */}
        <div className="navbar-user">
          <img src={adminimg} alt="Admin" />
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
