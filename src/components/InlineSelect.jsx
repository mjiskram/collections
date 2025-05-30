// src/components/InlineSelect.jsx
import React, { useState } from "react";

const InlineSelect = ({ value, onSave, options = [] }) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const commit = () => {
    setEditing(false);
    if (temp !== value) onSave(temp);
  };

  return editing ? (
    <select
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
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  ) : (
    <span onClick={() => setEditing(true)}>{value}</span>
  );
};

export default InlineSelect;
