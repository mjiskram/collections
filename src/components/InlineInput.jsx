// src/components/InlineInput.jsx
import React, { useState } from "react";
import { allCaps } from "../utils/stringUtils";

const InlineInput = ({ value, onSave, type = "text" }) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const commit = () => {
    setEditing(false);
    if (temp !== value) onSave(temp);
  };

  return editing ? (
    <input
      type={type}
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
    />
  ) : (
    <span onClick={() => setEditing(true)}>
     {value || "–"}
    </span>
  );
};

export default InlineInput;
