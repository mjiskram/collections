// src/components/Accordion.jsx
import React from "react";
import { Collapse } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";

export default function Accordion({ title, children, isOpen, onToggle }) {
  // If parent controls open state:
  const openState = typeof isOpen === "boolean" ? isOpen : false;

  return (
    <div className="card mb-3">
      <div
        className="card-header d-flex justify-content-between align-items-center"
        style={{ cursor: "pointer" }}
        onClick={onToggle}
      >
        <h5 className="mb-0">{title}</h5>
        {openState ? <ChevronUp /> : <ChevronDown />}
      </div>

      {/* Collapse will animate height */}
      <Collapse in={openState}>
        <div className="card-body">
          {children}
        </div>
      </Collapse>
    </div>
  );
}
