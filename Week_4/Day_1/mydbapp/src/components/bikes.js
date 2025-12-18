import React, { useEffect, useState } from "react";
import axios from "axios";
import "./cars.css";

function Bikes() {
  const [dataa, setDataa] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    Model: "",
    color: "",
    Torque: "",
    Mfg_year: "",
  });

  // Display Bike - Get
  const fetchCars = () => {
    axios.get("http://localhost:5000/Bikes").then((res) => {
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

  // Add Bike : Post
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/Bikes", formData).then(() => {
      setFormData({
        name: "",
        Model: "",
        color: "",
        Torque: "",
        Mfg_year: "",
      });
      fetchCars();
    });
  };

  // Delete Bike : Delete
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this Bike?")) return;

    axios
      .delete(`http://localhost:5000/Bikes/${id}`)
      .then(() => {
        setDataa(dataa.filter((item) => item.id !== id));
        alert("Bike deleted successfully!");
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
        <h3>Add New Bike</h3>

        <input
          type="text"
          name="name"
          placeholder="Enter Bike Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="Model"
          placeholder="Enter Bike Model"
          value={formData.Model}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="color"
          placeholder="Enter Bike Color"
          value={formData.color}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="Torque"
          placeholder="Enter Bike Torque"
          value={formData.Torque}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="Mfg_year"
          placeholder="Enter Manufacturing Year"
          value={formData.Mfg_year}
          onChange={handleChange}
          required
        />

        <button type="submit" onClick={handleSubmit}>
          Add Bike
        </button>
      </form>

      {/* TABLE */}
      <table className="car-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Model</th>
            <th>Color</th>
            <th>Torque</th>
            <th>Manufacturing Year</th>
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
              <td>{item.Mfg_year}</td>
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

export default Bikes;
