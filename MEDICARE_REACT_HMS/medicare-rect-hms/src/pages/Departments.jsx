import { useEffect, useState } from "react";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment
} from "../services/departmentService";

import "../assets/css/pages/departments.css";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [editDepartment, setEditDepartment] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const res = await getDepartments();
    setDepartments(res.data);
  };

  /* ======================
     DEPARTMENT ID GENERATOR
  ======================= */
  const generateDepartmentId = () => {
    const year = new Date().getFullYear();
    const deptOnly = departments.filter(d => d.id?.startsWith("DEPT-"));

    if (deptOnly.length === 0) {
      return `DEPT-${year}-0001`;
    }

    const last = deptOnly[deptOnly.length - 1];
    const num = Number(last.id.split("-")[2]) + 1;

    return `DEPT-${year}-${String(num).padStart(4, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editDepartment) {
      await updateDepartment(editDepartment.id, {
        ...editDepartment,
        name: departmentName
      });
      setEditDepartment(null);
    } else {
      await addDepartment({
        id: generateDepartmentId(),
        name: departmentName,
        createdAt: new Date().toISOString()
      });
    }

    setDepartmentName("");
    loadDepartments();
  };

  const handleEdit = (dept) => {
    setEditDepartment(dept);
    setDepartmentName(dept.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      await deleteDepartment(id);
      loadDepartments();
    }
  };

  return (
    <div className="department-page">

      {/* ===== ADD / EDIT FORM ===== */}
      <div className="department-card">
        <div className="form-header">
          <h5>{editDepartment ? "Edit Department" : "Add Department"}</h5>
          <p>Manage hospital departments</p>
        </div>

        <form onSubmit={handleSubmit} className="department-form">
          <input
            type="text"
            placeholder="Department Name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required
          />

          <button type="submit">
            {editDepartment ? "Update" : "Add"} Department
          </button>
        </form>
      </div>

      {/* ===== DEPARTMENT TABLE ===== */}
      <div className="department-card">
        <div className="department-table-header">
          <h6>Departments</h6>
          <span>Total: {departments.length}</span>
        </div>

        <table className="department-table">
          <thead>
            <tr>
              <th>Department ID</th>
              <th>Department Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td className="department-actions">
                  <button onClick={() => handleEdit(dept)}>
                    <i className="bi bi-pencil-fill text-primary"></i>
                  </button>

                  <button onClick={() => handleDelete(dept.id)}>
                    <i className="bi bi-trash-fill text-danger"></i>
                  </button>
                </td>
              </tr>
            ))}

            {departments.length === 0 && (
              <tr>
                <td colSpan="3" className="department-no-data">
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Departments;