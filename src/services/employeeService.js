import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const colRef = collection(db, "employees");

export const listenEmployees = (callback) =>
  onSnapshot(colRef, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

export const updateEmployee = (id, changes) =>
  updateDoc(doc(db, "employees", id), changes);

export const addEmployee = (data) => addDoc(colRef, data);

export const deleteEmployee = (id) =>
  deleteDoc(doc(db, "employees", id));

// new: mark as archived
export const archiveEmployee = (id) =>
  updateDoc(doc(db, "employees", id), { archived: true });
