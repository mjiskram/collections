// src/hooks/useEmployees.jsx
import { useContext, useMemo } from "react";
import { EmployeeContext } from "../context/EmployeeContext";

export const useEmployees = () => {
    const { employees: allEmployees, ...rest } = useContext(EmployeeContext);
    // always exclude archived employees
    const employees = useMemo(
    () => allEmployees.filter(emp => !emp.archived),
    [allEmployees]
    );
    return { employees, ...rest };
}

