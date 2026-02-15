// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   // ✅ UPDATED: role-based navigation
//   const handleLogin = async (email, password, role) => {
//     const user = await login(email, password);

//     if (!user) {
//       alert("Invalid credentials");
//       return;
//     }

//     if (role === "admin") navigate("/admin/dashboard");
//     if (role === "doctor") navigate("/doctor/dashboard");
//     if (role === "lab") navigate("/lab/dashboard");
//   };

//   return (
//     <div style={{ padding: 50, textAlign: "center" }}>
//       <h2>Select Role</h2>

//       {/* ADMIN */}  
//       <button
//         onClick={() =>
//           handleLogin("admin123@medicare.com", "admin@123", "admin")
//         }
//       >
//         Login as Admin
//       </button>

//       <br /><br />

//       {/* DOCTOR */}
//       <button
//         onClick={() =>
//           handleLogin("doctor@dynamic.com", "dynamic", "doctor")
//         }
//       >
//         Login as Doctor
//       </button>

//       <br /><br />

//       {/* 🧪 LAB (NEW) */}
//       <button
//         onClick={() =>
//           handleLogin("lab@medicare.com", "lab@123", "lab")
//         }
//       >
//         Login as Lab
//       </button>
//     </div>
//   );
// };

// export default Login;
