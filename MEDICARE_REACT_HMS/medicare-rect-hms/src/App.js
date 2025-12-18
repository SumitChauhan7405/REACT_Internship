import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <AppRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
