// src/components/DraggableAgent.jsx
import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS }          from "@dnd-kit/utilities";
import { useTeams }     from "../hooks/useTeams";
import { Button, Spinner } from "react-bootstrap";
import { X }            from "react-bootstrap-icons";

export default function DraggableAgent({ agent, teamId }) {
  const { removeTeamMember } = useTeams();
  const [isRemoving, setIsRemoving] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: agent.membershipId });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleRemove = async e => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    await removeTeamMember(teamId, agent.membershipId);
    setIsRemoving(false);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="list-group-item d-flex justify-content-between align-items-center"
    >
      <span {...attributes} {...listeners} style={{ cursor: 'grab', flexGrow: 1 }}>
        {agent.name}
      </span>
      <Button
        variant="link"
        onMouseDown={e => e.stopPropagation()}
        onClick={handleRemove}
        disabled={isRemoving}
      >
        {isRemoving ? <Spinner animation="border" size="sm" /> : <X />}
      </Button>
    </li>
  );
}
