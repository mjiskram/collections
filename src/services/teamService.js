// src/services/teamService.js
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const teamsRef = collection(db, "teams");

export const listenTeams = cb =>
  onSnapshot(teamsRef, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );

export const addTeam = data =>
  addDoc(teamsRef, { ...data, memberRecords: [] });

export const updateTeam = (id, changes) =>
  updateDoc(doc(db, "teams", id), changes);

export const deleteTeam = id =>
  deleteDoc(doc(db, "teams", id));

// create a new membership record
export async function addTeamMemberRecord(teamId, employeeId) {
  const teamRef = doc(db, "teams", teamId);
  const snap = await getDoc(teamRef);
  const recs = snap.data().memberRecords || [];
  if (!recs.some(r => r.employeeId === employeeId)) {
    const membershipId = `${teamId}_${employeeId}_${Date.now()}`;
    await updateDoc(teamRef, {
      memberRecords: arrayUnion({ membershipId, employeeId }),
    });
    return membershipId;
  }
  return null;
}

// remove a membership record
export async function removeTeamMemberRecord(teamId, membershipId) {
  const teamRef = doc(db, "teams", teamId);
  const snap = await getDoc(teamRef);
  const recs = snap.data().memberRecords || [];
  const rec = recs.find(r => r.membershipId === membershipId);
  if (rec) {
    await updateDoc(teamRef, {
      memberRecords: arrayRemove(rec),
    });
  }
}

// alias for easy import
export const addTeamMember = addTeamMemberRecord;
export const removeTeamMember = removeTeamMemberRecord;
