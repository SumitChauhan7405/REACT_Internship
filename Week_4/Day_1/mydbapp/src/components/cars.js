import React, { useEffect, useState } from "react";
import axios from "axios";
import "./cars.css";

function Cars() {
  const [dataa, setDataa] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    Model: "",
    color: "",
    Torque: "",
  });

  // ===== Display Car - Get
  const fetchCars = () => {
    axios.get("http://localhost:5000/Cars").then((res) => {
      setDataa(res.data);
    });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Car : Post
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/Cars", formData).then(() => {
      setFormData({
        name: "",
        Model: "",
        color: "",
        Torque: "",
      });
      fetchCars();
    });
  };

  // Delete Car : Delete
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this Car?")) return;

    axios
      .delete(`http://localhost:5000/Cars/${id}`)
      .then(() => {
        setDataa(dataa.filter((item) => item.id !== id));
        alert("Car deleted successfully!");
      })
      .catch((error) => {
        console.error("Delete failed:", error);
        alert("Failed to delete Bike");
      });
  };

  return (
    <div className="cars-container">
      {/* FORM */}
      <form className="car-form">
        <h3>Add New Car</h3>

        <input
          type="text"
          name="name"
          placeholder="Enter Car Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="Model"
          placeholder="Enter Car Model"
          value={formData.Model}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="color"
          placeholder="Enter Car Color"
          value={formData.color}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="Torque"
          placeholder="Enter Car Torque"
          value={formData.Torque}
          onChange={handleChange}
          required
        />

        <button type="submit" onClick={handleSubmit}>
          Add Car
        </button>
      </form>

      {/* TABLE */}
      <table className="car-table">
        <thead>
          <tr>
            <th>Car Name</th>
            <th>Car Model</th>
            <th>Car Color</th>
            <th>Car Torque</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {dataa.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.Model}</td>
              <td>{item.color}</td>
              <td>{item.Torque}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cars;
