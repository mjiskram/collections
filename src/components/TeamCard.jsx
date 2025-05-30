// src/components/TeamCard.jsx
import React, { useState, useRef, useMemo } from "react";
import { useDroppable }    from "@dnd-kit/core";
import { useEmployees }    from "../hooks/useEmployees";
import { useTeams }        from "../hooks/useTeams";
import DraggableAgent      from "./DraggableAgent";
import InlineInput         from "./InlineInput";
import {
  Form,
  Alert,
  Button,
  Overlay,
  Popover,
  ListGroup,
  Badge
} from "react-bootstrap";
import { Plus, BoxArrowRight, PersonPlus } from "react-bootstrap-icons";

export default function TeamCard({ team }) {
  const { employees } = useEmployees();
  const { saveTeam, addTeamMember, removeTeamMember } = useTeams();

  const [showAlert, setShowAlert]       = useState(false);
  const [alertMsg, setAlertMsg]         = useState("");
  const [showPicker, setShowPicker]     = useState(false);
  const [searchTerm, setSearchTerm]     = useState("");
  const [showTransfer, setShowTransfer] = useState(false);
  const [hoverName, setHoverName]       = useState(false);

  const pickerTarget   = useRef(null);
  const transferTarget = useRef(null);

  const { setNodeRef } = useDroppable({ id: `team-${team.id}` });

  // const members = (team.memberRecords || []).map(rec => {
  //   const emp = employees.find(e => e.id === rec.employeeId);
  //   return emp ? { ...emp, membershipId: rec.membershipId } : null;
  // }).filter(Boolean);

  const members = useMemo(() => {
    return (team.memberRecords || [])
      .map(rec => {
        const emp = employees.find(e => e.id === rec.employeeId);
        return emp
          ? { membershipId: rec.membershipId, id: emp.id, name: emp.name }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [team.memberRecords, employees]);

  const agentCount = members.length;

  const supervisors = employees.filter(
    e => e.position === "Supervisor" || e.position === "Team Lead"
  );
  const candidates = useMemo(
    () => employees
      .filter(e => e.position === "Agent" && !e.archived)
      .sort((a, b) => a.name.localeCompare(b.name)),
    [employees]
  );
  const filtered = useMemo(
    () => candidates
      .filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 20),
    [candidates, searchTerm]
  );


  const handleAddClick = () => {
    setSearchTerm("");
    setShowPicker(true);
  };

  const handleSelect = async emp => {
    if (team.memberRecords?.some(r => r.employeeId === emp.id)) {
      setAlertMsg(`"${emp.name}" is already in this team.`);
      setShowAlert(true);
    } else {
      await addTeamMember(team.id, emp.id);
    }
    setShowPicker(false);
  };

  const transferPopover = (
    <Popover id={`transfer-popover-${team.id}`}>
      <Popover.Header as="h6">Transfer Team To:</Popover.Header>
      <Popover.Body style={{ maxHeight: 200, overflowY: "auto" }}>
        <ListGroup variant="flush">
          {supervisors.filter(e =>
              (e.position === "Supervisor" || e.position === "Team Lead") &&
              !e.archived
            ).map(sup => (
            <ListGroup.Item
              key={sup.id}
              action
              active={sup.id === team.supervisorId}
              onClick={async () => {
                await saveTeam(team.id, { supervisorId: sup.id });
                setShowTransfer(false);
              }}
            >
              {sup.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Popover.Body>
    </Popover>
  );

  const addPopover = (
    <Popover id={`agent-picker-${team.id}`} style={{ maxWidth: 300 }}>
      <Popover.Header as="h6">Add Agent</Popover.Header>
      <Popover.Body>
        <Form.Control
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          size="sm"
          className="mb-2"
        />
        <ListGroup variant="flush" style={{ maxHeight: 200, overflowY: "auto" }}>
          {filtered.map(emp => (
            <ListGroup.Item
              key={emp.id}
              action
              onClick={() => handleSelect(emp)}
            >
              {emp.name}
            </ListGroup.Item>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-muted">No results</div>
          )}
        </ListGroup>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="border mb-3 p-2 team-card ">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div
          className="fw-bold"
          onMouseEnter={() => setHoverName(true)}
          onMouseLeave={() => setHoverName(false)}
          style={{ display: "inline-block" }}
        >
          <InlineInput
            value={team.name}
            onSave={name => saveTeam(team.id, { name })}
          />
          <Badge
            bg="secondary"
            className="ms-2"
            style={{
              opacity: hoverName ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            {agentCount}
          </Badge>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            ref={pickerTarget}
            onClick={handleAddClick}
          >
            <PersonPlus />
          </Button>
          <Button
            variant="outline"
            size="sm"
            ref={transferTarget}
            className="me-2"
            onClick={() => setShowTransfer(!showTransfer)}
          >
            <BoxArrowRight />
          </Button>
        </div>
      </div>

      {showAlert && (
        <Alert variant="warning" dismissible onClose={() => setShowAlert(false)}>
          {alertMsg}
        </Alert>
      )}

      <ul
        ref={setNodeRef}
        className="list-group list-group-flush mb-2"
        style={{ minHeight: "50px" }}
      >
        {members.map(agent => (
          <DraggableAgent
            key={agent.membershipId}
            agent={agent}
            teamId={team.id}
            removeTeamMember={removeTeamMember}
          />
        ))}
      </ul>

      <Overlay
        target={transferTarget.current}
        show={showTransfer}
        placement="bottom"
        rootClose
        onHide={() => setShowTransfer(false)}
      >
        {transferPopover}
      </Overlay>

      <Overlay
        target={pickerTarget.current}
        show={showPicker}
        placement="bottom"
        rootClose
        onHide={() => setShowPicker(false)}
      >
        {addPopover}
      </Overlay>
    </div>
  );
}
