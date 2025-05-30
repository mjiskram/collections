// src/App.jsx
import {useState} from "react";
import { EmployeeProvider } from "./context/EmployeeContext";
import EmployeeList        from "./components/EmployeeList";
import OrgChart            from "./components/OrgChart";
import Accordion           from "./components/Accordion";
import './app.css';
import { TeamProvider } from "./context/TeamContext";

export default function App() {
  const [activeAccordion, setActiveAccordion] = useState(null);
  return (
    <EmployeeProvider>
      <TeamProvider>
      <div className="container py-4">
        <label><h1>Alphaloans - Admin Monitoring</h1></label>
        <Accordion
          title="Training / Coaching"
          isOpen={activeAccordion === "training"}
          onToggle={() =>
            setActiveAccordion(prev =>
              prev === "training" ? null : "training"
            )
          }
        >
        </Accordion>
        <Accordion
          title="Teams"
          isOpen={activeAccordion === "teams"}
          onToggle={() =>
            setActiveAccordion(prev =>
              prev === "teams" ? null : "teams"
            )
          }
        >
          <OrgChart />
        </Accordion>
        <Accordion
          title="Employees Directory"
          isOpen={activeAccordion === "directory"}
          onToggle={() =>
            setActiveAccordion(prev =>
              prev === "directory" ? null : "directory"
            )
          }
        >
          <EmployeeList />
        </Accordion>
      </div>
      </TeamProvider>
    </EmployeeProvider>
  );
}
