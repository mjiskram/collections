// src/components/AgentSearch.jsx
import React, { useState, useMemo, useRef } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { useTeams } from "../hooks/useTeams";
import { Form, ListGroup, Badge, Button, Dropdown  } from "react-bootstrap";
import { Filter, SortAlphaDown, SortAlphaUp } from "react-bootstrap-icons";

export default function AgentSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const { employees } = useEmployees();
  const { teams } = useTeams();

  const [sortAsc, setSortAsc]       = useState(true);
  const [sortField, setSortField]   = useState("name");       // "name" | "supervisor"


  const filteredAgents = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return employees.filter(e =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, employees]);

 // get supervisors for each agent
 const getAssignedSupervisors = agentId => {
   const supIds = new Set();
   teams.forEach(t => {
     if (
       Array.isArray(t.memberRecords) &&
       t.memberRecords.some(r => r.employeeId === agentId) &&
       t.supervisorId
     ) {
       supIds.add(t.supervisorId);
     }
   });
   return Array.from(supIds)
     .map(id => {
       const sup = employees.find(e => e.id === id);
       return sup ? sup.name : null;
     })
     .filter(Boolean);
 };


  const getAssignedTeams = agentId =>
    teams
      .filter(t =>
        Array.isArray(t.memberRecords) &&
        t.memberRecords.some(r => r.employeeId === agentId)
      )
      .map(t => t.name);

  // filter & display teams matching the search term
  // const filteredTeams = useMemo(() => {
  //   if (!searchTerm.trim()) return [];
  //   return teams.filter(t =>
  //     t.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [searchTerm, teams]);

 const filteredTeams = useMemo(() => {
   if (!searchTerm.trim()) return [];
   const term = searchTerm.toLowerCase();
   // if user types "team" or "teams", show all teams
   if (term.includes('team')) {
     return teams;
   }
   return teams.filter(t =>
     t.name.toLowerCase().includes(term)
   );
 }, [searchTerm, teams]);

  const displayedAgents = filteredAgents.slice(0, 5).map(a => ({ ...a, type: 'agent' }));
  // const displayedTeams  = filteredTeams .slice(0, 5).map(t => ({ ...t, type: 'team'  }));

 const displayedTeams = useMemo(() => {
   const teamItems = filteredTeams.map(t => ({ ...t, type: 'team' }));
   // show all teams when searching "team", otherwise limit to 5
   return searchTerm.toLowerCase().includes('team')
     ? teamItems
     : teamItems.slice(0, 5);
 }, [filteredTeams, searchTerm]);


  // const displayedItems  = [...displayedAgents, ...displayedTeams]
  //   .sort((a, b) => a.name.localeCompare(b.name));

const displayedItems = useMemo(() => {
  const items = [...displayedAgents, ...displayedTeams];
  return items.sort((a, b) => {
    let aKey, bKey;
    if (sortField === "name") {
      aKey = a.name.toLowerCase();
      bKey = b.name.toLowerCase();
    } else {
      // sort by supervisor name (teams only)
      const supName = id =>
        employees.find(e => e.id === id)?.name.toLowerCase() || "";
      aKey = a.type === "team" ? supName(a.supervisorId) : "";
      bKey = b.type === "team" ? supName(b.supervisorId) : "";
    }
    if (aKey < bKey) return sortAsc ? -1 : 1;
    if (aKey > bKey) return sortAsc ? 1 : -1;
    return 0;
  });
}, [displayedAgents, displayedTeams, sortField, sortAsc, employees]);

  const SortTeamResult = () => (
     <Dropdown className="ms-2">
       <Dropdown.Toggle variant="outline-secondary" size="sm">
         Sort by: {sortField === "name" ? "Team" : "Supervisor"} {sortAsc ? "↑" : "↓"}
       </Dropdown.Toggle>
       <Dropdown.Menu>
         <Dropdown.Item
           active={sortField === "name" && sortAsc}
           onClick={() => { setSortField("name"); setSortAsc(true); }}
         >
           Team ↑
         </Dropdown.Item>
         <Dropdown.Item
           active={sortField === "name" && !sortAsc}
           onClick={() => { setSortField("name"); setSortAsc(false); }}
         >
           Team ↓
         </Dropdown.Item>
         <Dropdown.Item
           active={sortField === "supervisor" && sortAsc}
           onClick={() => { setSortField("supervisor"); setSortAsc(true); }}
         >
           Supervisor ↑
         </Dropdown.Item>
         <Dropdown.Item
           active={sortField === "supervisor" && !sortAsc}
           onClick={() => { setSortField("supervisor"); setSortAsc(false); }}
         >
           Supervisor ↓
         </Dropdown.Item>
       </Dropdown.Menu>
     </Dropdown>
  );

  return (
    <div className="mb-1 agent-search">
      <div className="input-group">
      <Form.Control
        type="text"
        placeholder='Type "team" or search agent...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
        <Button
            variant="outline-secondary"
            onClick={() => setSearchTerm('')}
         >
          Clear
        </Button>
      </div>
      
      {searchTerm.toLowerCase().includes('team') && (
      <div className="d-flex justify-content-between mt-2">
          <span>Total Teams: {filteredTeams.length}</span>
          <SortTeamResult />
      </div>
      )}
     <ListGroup className="mt-2">
       {displayedItems.map(agent => {
         const teamsList = getAssignedTeams(agent.id);
         const supsList  = getAssignedSupervisors(agent.id);
         if (agent.type === 'agent') {
           return (
             <ListGroup.Item
               action
               key={`agent-${agent.id}`}
               className="d-flex justify-content-between align-items-center"
             >
               <span>{agent.name}</span>
               <div>
                  <Badge className="me-2" bg="info">
                    {teamsList.join(", ") || "Unassigned"}
                  </Badge>
                  <Badge bg="secondary">
                    {supsList.join(", ") || "Unassigned"}
                  </Badge>
               </div>
             </ListGroup.Item>
           );
         } else {
           const sup = employees.find(e => e.id === agent.supervisorId);
           const supName = sup ? sup.name : "—";
           const agentCount = Array.isArray(agent.memberRecords)
             ? agent.memberRecords.length
             : 0;
           return (
             <ListGroup.Item
              action
               key={`team-${agent.id}`}
               className="d-flex justify-content-between align-items-center"
             >
               <div>
                 <strong className="me-2">{agent.name}</strong>
                 <Badge bg="info">{agentCount} agent{ (agent.memberRecords?.length || 0) !== 1 ? "s" : "" }</Badge>
               </div>
               <Badge bg="secondary">{supName}</Badge>
             </ListGroup.Item>
           );
         }
       })}
       {searchTerm.trim() && displayedItems.length === 0 && (
         <div className="text-center text-muted py-2">
           No results found.
         </div>
       )}
     </ListGroup>
    </div>
  );
}
