// src/hooks/useTeams.jsx
import { useContext } from "react";
import { TeamContext } from "../context/TeamContext";

export const useTeams = () => useContext(TeamContext);
