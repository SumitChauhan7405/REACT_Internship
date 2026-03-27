import { useEffect, useState } from "react";
import axios from "axios";
import { getDepartments } from "../../services/departmentService";
import "../../assets/css/pages/lab-test-masters.css";

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
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* Load Lab Test Master */
  const loadLabTests = async () => {
    const res = await axios.get("http://localhost:5000/labTestMasters");
    setLabTests(res.data);
  };

  /* Load Departments */
  const loadDepartments = async () => {
    const res = await getDepartments();
    setDepartments(res.data);
  };

  useEffect(() => {
    loadLabTests();
    loadDepartments();
  }, []);

  /* Handlers */
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

  const filteredLabTests = labTests.filter((t) => {
    const term = searchTerm.toLowerCase();

    return (
      t.name?.toLowerCase().includes(term) ||
      t.department?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-content">
      <div className="patient-form-card mb-4">
        <div
          className="form-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h4>{editingId ? "Edit Lab Test" : "Add New Lab Test"}</h4>

          <div className="table-search" style={{ width: "250px" }}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search test or department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
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

        <table className="lab-master-table">
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
            {filteredLabTests.map((t) => (
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
