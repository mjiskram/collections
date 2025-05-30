// src/components/OrgChart.jsx
import React, { useState, useEffect } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Modal, Button, Spinner, Stack, Card } from "react-bootstrap";
import { Check2Circle, Circle, Filter } from "react-bootstrap-icons";
import { useEmployees } from "../hooks/useEmployees";
import { useTeams }     from "../hooks/useTeams";
import SummaryCards     from "./SummaryCards";
import SupervisorCard   from "./SupervisorCard";
import TeamsLoader from "./TeamsLoader";
import './teams.css';

export default function OrgChart() {
  const { employees } = useEmployees();
  const { teams, addTeamMember, removeTeamMember } = useTeams();

  // state for our one-time sorted managers
  const [sortedManagers, setSortedManagers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isLoading && employees.length > 0) {
      const managers = employees.filter(e =>
        e.position === "Supervisor" || e.position === "Team Lead"
      );
      const sorted = [...managers].sort((a, b) => {
        const countAgents = mgr =>
          teams
            .filter(t => t.supervisorId === mgr.id)
            .reduce((sum, t) => sum + (t.memberRecords?.length || 0), 0);
        return countAgents(a) - countAgents(b);
      });
      setSortedManagers(sorted);
      setIsLoading(false);
    }
  }, [employees, teams, isLoading]);

  // filter state
  const [filterManagers, setFilterManagers] = useState([]);
  const toggleManager = id => {
    setFilterManagers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // apply filters: if none selected, show all sortedManagers
  const displayedManagers =
    filterManagers.length > 0
      ? sortedManagers.filter(m => filterManagers.includes(m.id))
      : sortedManagers;

  // drag-and-drop & modal state
  const [activeAgent, setActiveAgent] = useState(null);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    membershipId: null,
    employeeId: null,
    agentName: "",
    fromTeam: null,
    toTeam: null,
  });
  const [loading, setLoading] = useState(false);

  const handleDragStart = ({ active }) => {
    const rec = teams
      .flatMap(t => (t.memberRecords || []).map(r => ({ ...r, teamId: t.id })))
      .find(r => r.membershipId === active.id);
    if (rec) {
      const emp = employees.find(e => e.id === rec.employeeId);
      setActiveAgent(emp);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveAgent(null);
    if (!over?.id.startsWith("team-")) return;
    const toTeam = over.id.replace("team-", "");
    const fromEntry = teams.find(t =>
      t.memberRecords?.some(r => r.membershipId === active.id)
    );
    if (!fromEntry || fromEntry.id === toTeam) return;
    const rec = fromEntry.memberRecords.find(r => r.membershipId === active.id);
    const emp = employees.find(e => e.id === rec.employeeId);
    setModalInfo({
      show: true,
      membershipId: rec.membershipId,
      employeeId: rec.employeeId,
      agentName: emp.name,
      fromTeam: fromEntry.id,
      toTeam,
    });
  };

  const closeModal = () => {
    if (loading) return;
    setModalInfo({
      show: false,
      membershipId: null,
      employeeId: null,
      agentName: "",
      fromTeam: null,
      toTeam: null,
    });
  };

  const handleMove = async () => {
    setLoading(true);
    await removeTeamMember(modalInfo.fromTeam, modalInfo.membershipId);
    await addTeamMember(modalInfo.toTeam, modalInfo.employeeId);
    setLoading(false);
    closeModal();
  };

  const handleReplicate = async () => {
    setLoading(true);
    await addTeamMember(modalInfo.toTeam, modalInfo.employeeId);
    setLoading(false);
    closeModal();
  };

  if (isLoading) return <TeamsLoader />


  return (
    <>
      {/* Summary cards */}
      <SummaryCards />

      {/* Filter chips inside a card */}
      <Card className="mb-3">
        <Card.Body>
          <h6 className="text-muted mb-3"><Filter className="me-1"/>Select Manager</h6>
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            <Button
              variant="outline-primary"
              size="sm"
              className="rounded-pill"
              onClick={() => setFilterManagers([])}
            >
              Clear All
            </Button>
              {sortedManagers.map(mgr => {
                const label = mgr.name.split(" ")[0];
                const isSelected = filterManagers.includes(mgr.id);
                return (
                  <Button
                    key={mgr.id}
                    variant={isSelected ? "primary" : "outline-secondary"}
                    size="sm"
                    className="rounded-pill"
                    onClick={() => toggleManager(mgr.id)}
                  >

                    {isSelected ? <Check2Circle className="me-1" /> : <Circle className="me-1" />}
                    {label}
                  </Button>
                );
              })}
          </Stack>
        </Card.Body>
      </Card>

      {/* Org chart grid */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <DragOverlay>
          {activeAgent && <div className="drag-overlay">{activeAgent.name}</div>}
        </DragOverlay>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {displayedManagers.map(mgr => (
            <SupervisorCard key={mgr.id} supervisor={mgr} teams={teams} />
          ))}
        </div>
      </DndContext>

      {/* Replicate/Move modal */}
      <Modal show={modalInfo.show} onHide={closeModal} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Move Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <p>Agent <strong>{modalInfo.agentName}</strong> was dropped on a new team.</p>
           <p>"SHARE" to grant dual-team access or fully "TRANSFER" to another team.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleMove} disabled={loading}>
            {loading ? <><Spinner size="sm" animation="border" /> </> : "Full Transfer"}
          </Button>
          <Button variant="outline-primary" onClick={handleReplicate} disabled={loading}>
            {loading ? <><Spinner size="sm" animation="border" /> </> : "Share Only"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
