// src/context/TeamContext.jsx
import React, { createContext, useState, useEffect } from "react";
import {
  listenTeams,
  addTeam,
  updateTeam,
  deleteTeam,
  addTeamMemberRecord,
  removeTeamMemberRecord,
} from "../services/teamService";

export const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const unsub = listenTeams(setTeams);
    return () => unsub();
  }, []);

  return (
    <TeamContext.Provider value={{
      teams,
      addTeam,
      saveTeam: updateTeam,
      deleteTeam,
      addTeamMember: addTeamMemberRecord,
      removeTeamMember: removeTeamMemberRecord,
    }}>
      {children}
    </TeamContext.Provider>
  );
}
