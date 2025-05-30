import React, { createContext, useState, useEffect } from "react";
import {
  listenEmployees,
  updateEmployee,
  addEmployee as addEmployeeService,
  deleteEmployee as deleteEmployeeService,
  archiveEmployee as archiveEmployeeService, // ← new
} from "../services/employeeService";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const unsub = listenEmployees(setEmployees);
    return () => unsub();
  }, []);

  const saveEmployee   = (id, data) => updateEmployee(id, data);
  const addEmployee    = (data)      => addEmployeeService(data);
  const removeEmployee = (id)        => deleteEmployeeService(id);
  const archiveEmployee= (id)        => archiveEmployeeService(id); // ← new

  return (
    <EmployeeContext.Provider
      value={{ employees, saveEmployee, addEmployee, removeEmployee, archiveEmployee }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
