import React from "react";
import { Button }        from "react-bootstrap";
import InlineInput       from "./InlineInput";
import InlineSelect      from "./InlineSelect";
import { useEmployees }  from "../hooks/useEmployees";
import { sentenceCase }  from "../utils/stringUtils";
import { formatTenure }  from "../utils/dateUtils";
import { Archive }       from "react-bootstrap-icons";

const POSITIONS = ["Supervisor", "Team Lead", "Agent"];
const STATUSES  = ["Active", "Resigned", "Terminated", "Suspended"];

export default function EmployeeRow({ employee, months }) {
  const { saveEmployee, archiveEmployee } = useEmployees();

  const mkHandler = field => val => {
    const payload = field === "name" ? sentenceCase(val) : val;
    saveEmployee(employee.id, { [field]: payload });
  };

  return (
    <tr>
      <td>
        <InlineInput
          value={sentenceCase(employee.name)}
          onSave={mkHandler("name")}
        />
      </td>
      <td>
        <InlineSelect
          value={employee.position}
          options={POSITIONS}
          onSave={mkHandler("position")}
        />
      </td>
      <td>
        <InlineInput
          type="date"
          value={employee.dateHired}
          onSave={mkHandler("dateHired")}
        />
      </td>
       {/* tenure */}
      <td>
        <span>{formatTenure(employee.dateHired)}</span>
      </td>

      {/* … remaining cells … */}
      <td>
        <InlineInput
          value={employee.contact}
          onSave={mkHandler("contact")}
        />
      </td>
      <td>
        <InlineInput
          type="email"
          value={employee.email}
          onSave={mkHandler("email")}
        />
      </td>
      <td>
        <InlineSelect
          value={employee.status || "Active"}
          options={STATUSES}
          onSave={mkHandler("status")}
        />
      </td>
      <td>
        <Button
          variant="outline-warning"
          size="sm"
          onClick={() => archiveEmployee(employee.id)}
        >
          <Archive /> Archive
        </Button>
      </td>
    </tr>
  );
}
