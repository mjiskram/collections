import React, { useState, useMemo } from "react";
import { useEmployees } from "../hooks/useEmployees";
import EmployeeRow     from "./EmployeeRow";
import EmployeeForm from './EmployeeForm';
import { ArrowUp, ArrowDown } from "react-bootstrap-icons";
import { Form, InputGroup }   from "react-bootstrap";

// Add a header for months of stay after dateHired
const HEADERS = [
  { key: "name",      label: "Name",           width: "160px" },
  { key: "position",  label: "Position",       width: "120px" },
  { key: "dateHired", label: "Date Hired",     width: "130px" },
  { key: "months",    label: "Tenure", width: "120px" },  // ← new
  { key: "contact",   label: "Contact No.",    width: "150px" },
  { key: "email",     label: "Email",          width: "200px" },
  { key: "status",    label: "Status",         width: "100px" },
  { key: "action",    label: "Action",         width: "100px" },
];

// helper to compute full months between hire date and today
const calcMonths = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  let months =
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth() - d.getMonth());
  if (now.getDate() < d.getDate()) months--;
  return months >= 0 ? months : 0;
};

export default function EmployeeList() {
  const { employees } = useEmployees();
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out archived
  const activeEmployees = useMemo(
    () => employees.filter(e => !e.archived),
    [employees]
  );

  // Sort, handling "months" specially
  const sortedEmployees = useMemo(() => {
    const { key, direction } = sortConfig;
    const list = [...activeEmployees];
    if (!key || key === "action") return list;
    return list.sort((a, b) => {
      let aVal, bVal;
      if (key === "months") {
        aVal = calcMonths(a.dateHired);
        bVal = calcMonths(b.dateHired);
      } else {
        aVal = (a[key] || "").toString().toLowerCase();
        bVal = (b[key] || "").toString().toLowerCase();
      }
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [activeEmployees, sortConfig]);

  // Search by name, position, contact, email
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return sortedEmployees.filter(emp =>
      [emp.name, emp.position, emp.contact, emp.email]
        .some(val => val?.toLowerCase().includes(q))
    );
  }, [sortedEmployees, searchQuery]);

  const handleSort = key => {
    if (key === "action") return;
    setSortConfig(curr => ({
      key,
      direction: curr.key === key && curr.direction === "asc"
        ? "desc"
        : "asc",
    }));
  };

  return (
    <>
      <EmployeeForm />
      <hr/>
      {/* Search */}
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by name, position, contact or email…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      <table className="table" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            {HEADERS.map(h => (
              <th
                key={h.key}
                style={{
                  cursor: h.key === "action" ? "default" : "pointer",
                  userSelect: "none",
                  width: h.width,
                }}
                onClick={() => handleSort(h.key)}
              >
                {h.label}
                {sortConfig.key === h.key
                  ? (
                    sortConfig.direction === "asc"
                      ? <ArrowUp size={12} className="ms-1" />
                      : <ArrowDown size={12} className="ms-1" />
                  )
                  : (
                    <span
                      className="ms-1"
                      style={{ fontSize: "0.8em", color: "#ccc" }}
                    >
                      ⭥
                    </span>
                  )
                }
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <EmployeeRow
              key={emp.id}
              employee={emp}
              months={calcMonths(emp.dateHired)}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
