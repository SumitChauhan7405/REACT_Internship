import "../Navbar/navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
     <nav className="navbar">
      <div className="container navbar-content">
        <div className="logo">
          <h2>Data Fetch From API</h2>
        </div>

        <div className="nav-menu">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/posts" className="nav-link">Posts</NavLink>
          <NavLink to="/comments" className="nav-link">Comments</NavLink>
          <NavLink to="/albums" className="nav-link">Albums</NavLink>
          <NavLink to="/photos" className="nav-link">Photos</NavLink>
          <NavLink to="/todos" className="nav-link">Todos</NavLink>
          <NavLink to="/users" className="nav-link">Users</NavLink>
          <NavLink to="/cars" className="nav-link">Cars</NavLink>
          <NavLink to="/bikes" className="nav-link">Bikes</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
