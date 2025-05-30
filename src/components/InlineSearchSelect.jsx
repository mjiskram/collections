import React, { useState } from "react";
import { Form } from "react-bootstrap";

/**
 * Inline dropdown with search (via <datalist>).
 * listId must be unique per instance.
 * options: [{ id, name }]
 */
export default function InlineSearchSelect({ listId, value, options, onSave }) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const commit = () => {
    setEditing(false);
    if (temp !== value) onSave(temp);
  };

  return editing ? (
    <>
      <Form.Control
        list={listId}
        value={temp}
        onChange={e => setTemp(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        autoFocus
        size="sm"
      />
      <datalist id={listId}>
        {options.map(o => (
          <option key={o.id} value={o.name} />
        ))}
      </datalist>
    </>
  ) : (
    <span
      style={{ cursor: "pointer" }}
      onClick={() => {
        setTemp(value);
        setEditing(true);
      }}
    >
      {value || "—"}
    </span>
  );
}
