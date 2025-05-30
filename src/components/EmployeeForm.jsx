// src/components/EmployeeForm.jsx
import React, { useState } from "react";
import { useEmployees }   from "../hooks/useEmployees";

const POSITIONS = ["Agent", "Team Lead", "Supervisor"];

export default function EmployeeForm() {
  const { addEmployee } = useEmployees();
  const [form, setForm] = useState({
    name: "",
    position: POSITIONS[0],
    dateHired: "",
    contact: "",
    email: ""
  });

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    // basic validation
    if (!form.name.trim()) return alert("Name is required");
    await addEmployee(form);
    setForm({ name:"", position:POSITIONS[0], dateHired:"", contact:"", email:"" });
  };

  return (
    <fieldset className="group-border">
        <form
        onSubmit={onSubmit}
        style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto",
            gap: "8px",
            marginBottom: "20px",
        }}
        >
        <input
            name="name"
            className="form-control"
            value={form.name}
            onChange={onChange}
            placeholder="Name"
            required
        />
        <select
            name="position"
            className="form-control"
            value={form.position}
            onChange={onChange}
            
        >
            {POSITIONS.map(p => (
            <option key={p} value={p}>{p}</option>
            ))}
        </select>
        <input
            name="dateHired"
            type="date"
            className="form-control"
            value={form.dateHired}
            onChange={onChange}
          
        />
        <input
            name="contact"
            type="text"
            className="form-control"
            value={form.contact}
            onChange={onChange}
            placeholder="Contact No."
        />
        <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
        />
        <button className="btn btn-outline-primary btn-sm" type="submit">Register New Employee</button>
        </form>
    </fieldset>
  );
}
