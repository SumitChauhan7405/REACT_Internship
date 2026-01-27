import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/pages/surgery-masters.css";

const emptyForm = {
  name: "",
  charge: "",
  visibility: "GENERAL",
  department: ""
};

const SurgeryMaster = () => {
  const [surgeries, setSurgeries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  /* ======================
     LOAD SURGERY MASTERS
  ======================= */
  const loadSurgeries = async () => {
    const res = await axios.get("http://localhost:5000/surgeryMasters");
    setSurgeries(res.data);
  };

  useEffect(() => {
    loadSurgeries();
  }, []);

  /* ======================
     HANDLERS
  ======================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateId = () => {
    if (surgeries.length === 0) return "SM-001";
    const last = surgeries[surgeries.length - 1];
    const num = Number(last.id.split("-")[1]) + 1;
    return `SM-${String(num).padStart(3, "0")}`;
  };

  /* ======================
     SUBMIT
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.charge) {
      alert("Please fill required fields");
      return;
    }

    if (editingId) {
      await axios.patch(
        `http://localhost:5000/surgeryMasters/${editingId}`,
        {
          ...form,
          charge: Number(form.charge)
        }
      );
    } else {
      await axios.post("http://localhost:5000/surgeryMasters", {
        id: generateId(),
        ...form,
        charge: Number(form.charge)
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    loadSurgeries();
  };

  /* ======================
     EDIT
  ======================= */
  const handleEdit = (surgery) => {
    setForm({
      name: surgery.name,
      charge: surgery.charge,
      visibility: surgery.visibility || "GENERAL",
      department: surgery.department || ""
    });
    setEditingId(surgery.id);
  };

  /* ======================
     DELETE
  ======================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this surgery?")) {
      await axios.delete(`http://localhost:5000/surgeryMasters/${id}`);
      loadSurgeries();
    }
  };

  /* ======================
     UI
  ======================= */
  return (
    <div className="page-content">
      <div className="patient-form-card mb-4">
        <div className="form-header">
          <h4>{editingId ? "Edit Surgery" : "Add New Surgery"}</h4>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Surgery Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="charge"
            placeholder="Charge (₹)"
            value={form.charge}
            onChange={handleChange}
          />

          <select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
          >
            <option value="GENERAL">General</option>
            <option value="DEPARTMENT">Department Specific</option>
          </select>

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            disabled={form.visibility !== "DEPARTMENT"}
          >
            <option value="">Select Department</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Radiology">Radiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Neurology">Neurology</option>
            <option value="General Medicine">General Medicine</option>
          </select>

          <button type="submit" className="btn-primary">
            {editingId ? "Update" : "Add"} Surgery
          </button>
        </form>
      </div>

      <div className="patient-table-card">
        <div className="table-header">
          <h4>All Surgeries</h4>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Charge</th>
              <th>Visibility</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {surgeries.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>₹ {s.charge}</td>
                <td>{s.visibility || "GENERAL"}</td>
                <td>{s.department || "—"}</td>
                <td>
                  <button
                    className="icon-btn edit"
                    onClick={() => handleEdit(s)}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>

                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(s.id)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurgeryMaster;
