import { useAuth } from "../../context/AuthContext";

const DoctorDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h3>Doctor Dashboard</h3>
      <p>Welcome  {user?.data?.name}</p>
      <p>Department: {user?.data?.department}</p>
      <p>Welcome! Here you will see your assigned patients.</p>
    </div>
  );
};

export default DoctorDashboard;
