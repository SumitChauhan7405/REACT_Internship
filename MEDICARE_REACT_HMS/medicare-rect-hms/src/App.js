import { BrowserRouter } from "react-router-dom";
// import Sidebar from "./components/common/Sidebar";
// import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
     <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
