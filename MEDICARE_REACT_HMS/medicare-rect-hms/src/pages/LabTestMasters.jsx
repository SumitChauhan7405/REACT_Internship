import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/pages/lab-test-masters.css";

const emptyForm = {
  name: "",
  charge: "",
  visibility: "GENERAL",
  department: ""
};

const LabTestMaster = () => {
  const [labTests, setLabTests] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  /* ======================
     LOAD LAB TEST MASTERS
  ======================= */
  const loadLabTests = async () => {
    const res = await axios.get("http://localhost:5000/labTestMasters");
    setLabTests(res.data);
  };

  useEffect(() => {
    loadLabTests();
  }, []);

  /* ======================
     HANDLERS
  ======================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateId = () => {
    if (labTests.length === 0) return "LT-001";
    const last = labTests[labTests.length - 1];
    const num = Number(last.id.split("-")[1]) + 1;
    return `LT-${String(num).padStart(3, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.charge) {
      alert("Please fill required fields");
      return;
    }

    if (editingId) {
      await axios.patch(`http://localhost:5000/labTestMasters/${editingId}`, {
        ...form,
        charge: Number(form.charge)
      });
    } else {
      await axios.post("http://localhost:5000/labTestMasters", {
        id: generateId(),
        ...form,
        charge: Number(form.charge)
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    loadLabTests();
  };

  const handleEdit = (test) => {
    setForm({
      name: test.name,
      charge: test.charge,
      visibility: test.visibility || "GENERAL",
      department: test.department || ""
    });
    setEditingId(test.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this lab test?")) {
      await axios.delete(`http://localhost:5000/labTestMasters/${id}`);
      loadLabTests();
    }
  };

  /* ======================
     UI
  ======================= */
  return (
    <div className="page-content">
      <div className="patient-form-card mb-4">
        <div className="form-header">
          <h4>{editingId ? "Edit Lab Test" : "Add New Lab Test"}</h4>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Test Name"
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

          <select name="visibility" value={form.visibility} onChange={handleChange}>
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
            <option value="ENT">ENT</option>
            <option value="General Medicine">General Medicine</option>
          </select>

          <button type="submit" className="btn-primary">
            {editingId ? "Update" : "Add"} Test
          </button>
        </form>
      </div>

      <div className="patient-table-card">
        <div className="table-header">
          <h4>All Lab Tests</h4>
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
            {labTests.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>₹ {t.charge}</td>
                <td>{t.visibility || "GENERAL"}</td>
                <td>{t.department || "—"}</td>
                <td>
                  <button className="icon-btn edit" onClick={() => handleEdit(t)}>
                    <i className="bi bi-pencil-fill"></i>
                  </button>

                  <button className="icon-btn delete" onClick={() => handleDelete(t.id)}>
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

export default LabTestMaster;
