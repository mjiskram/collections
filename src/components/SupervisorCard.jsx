// src/components/SupervisorCard.jsx
import React, { useState, useRef, useMemo } from "react";
import { useTeams } from "../hooks/useTeams";
import TeamCard from "./TeamCard";
import {
  OverlayTrigger,
  Popover,
  Button,
  InputGroup,
  Form,
  Badge,
  ListGroup,
  Stack,
  Spinner
} from "react-bootstrap";
import { FileX, Plus, PlusCircleDotted, Trash } from "react-bootstrap-icons";

export default function SupervisorCard({ supervisor, teams }) {
const { addTeam, deleteTeam } = useTeams();

  const [teamName, setTeamName]       = useState("");
  const [showAdd, setShowAdd]         = useState(false);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [showRemove, setShowRemove]   = useState(false);
  const [confirmTeamId, setConfirmTeamId] = useState(null);
  const [isDeleting, setIsDeleting]   = useState(false);

  const addTarget    = useRef(null);
  const removeTarget = useRef(null);

  // const myTeams = useMemo(
  //   () => teams.filter(t => t.supervisorId === supervisor.id),
  //   [teams, supervisor.id]
  // );

  const myTeams = useMemo(() => {
    return teams
      .filter(t => t.supervisorId === supervisor.id)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [teams, supervisor.id]);

  const count       = myTeams.length;

  // const totalAgents = myTeams.reduce(
  //   (sum, t) => sum (t.memberRecords?.length || 0),
  //   0
  // );

const totalAgents = useMemo(() => {
  if (!myTeams || myTeams.length === 0) return 0;
  return myTeams.reduce((sum, t) => {
    const cnt = Array.isArray(t.memberRecords) ? t.memberRecords.length : 0;
    return sum + cnt;
  }, 0);
}, [myTeams]);

 const summaryPopover = (
   <Popover id={`summary-popover-${supervisor.id}`}>
     <Popover.Body>
       <ListGroup variant="flush">
         {myTeams.map(t => (
           <ListGroup.Item key={t.id}>
             <strong>{t.name}</strong>
             <Badge bg="info" className="ms-2">
                {t.memberRecords?.length || 0} agent
                { (t.memberRecords?.length || 0) !== 1 ? "s" : "" }
              </Badge>
           </ListGroup.Item>
         ))}
         {myTeams.length === 0 && (
           <div className="text-center text-muted">No teams</div>
         )}
       </ListGroup>
     </Popover.Body>
   </Popover>
 );

  const addPopover = (
    <Popover id={`add-team-${supervisor.id}`}>
      <Popover.Header as="h6">Add Team</Popover.Header>
      <Popover.Body>
        <InputGroup size="sm">
          <Form.Control
            placeholder="Team Name"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
          />
          <Button
            disabled={!teamName.trim() || isAddingTeam}
            onClick={async () => {
              setIsAddingTeam(true);
              await addTeam({ name: teamName, supervisorId: supervisor.id, memberRecords: [] });
              setTeamName("");
              setShowAdd(false);
              setIsAddingTeam(false);
            }}
          >
             {isAddingTeam
              ? <Spinner animation="border" size="sm" />
              : "Add"
            }
          </Button>
        </InputGroup>
      </Popover.Body>
    </Popover>
  );

 const removePopover = (
    <Popover id={`remove-team-${supervisor.id}`} style={{ minWidth: 220 }}>
      <Popover.Header as="h6">Remove Team</Popover.Header>
      <Popover.Body>
        {!confirmTeamId ? (
          <ListGroup variant="flush">
            {myTeams.map(t => (
              <ListGroup.Item
                key={t.id}
                action
                onClick={() => setConfirmTeamId(t.id)}
              >
                {t.name}
              </ListGroup.Item>
            ))}
            {myTeams.length === 0 && (
              <div className="text-center text-muted">No teams</div>
            )}
          </ListGroup>
        ) : (
          <Stack gap={2}>
            <div>
              Delete <strong>{myTeams.find(t => t.id === confirmTeamId)?.name}</strong>?
            </div>
            <Stack direction="horizontal" gap={2}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setConfirmTeamId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  await deleteTeam(confirmTeamId);
                  setIsDeleting(false);
                  setConfirmTeamId(null);
                  setShowRemove(false);
                }}
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </Button>
            </Stack>
          </Stack>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="border p-3 supervisor-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={summaryPopover}
          rootClose
        >
          <div style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
            <span className="fw-bold outline-link">#Team {supervisor.name.split(" ")[0]}</span>
            <Badge bg="secondary" className="ms-2">{count}</Badge>
        </div>
        </OverlayTrigger>
        <div>
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            show={showAdd}
            onToggle={() => setShowAdd(!showAdd)}
            overlay={addPopover}
            rootClose
          >
            <Button
              ref={addTarget}
              variant="outline"
              size="sm"
            >
              <PlusCircleDotted />
            </Button>
          </OverlayTrigger>
                    <OverlayTrigger
            trigger="click"
            placement="bottom"
            show={showRemove}
            onToggle={() => setShowRemove(!showRemove)}
            overlay={removePopover}
            rootClose
          >
            <Button
              ref={removeTarget}
              variant="outline"
              size="sm"
              disabled={isDeleting}
            >
              <Trash />
            </Button>
          </OverlayTrigger>
        </div>
      </div>
      <div className="mt-3 text-end">
        <small className="text-muted">
          # slot: <strong>{totalAgents}</strong>
        </small>
      </div>
      {myTeams.map(team => (
        <TeamCard key={team.id} team={team} />
      ))}

    </div>
  );
}
