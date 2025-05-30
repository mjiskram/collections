// src/components/SummaryCards.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useTeams }     from '../hooks/useTeams';
import {
  Card,
  Row,
  Col,
  Modal,
  Accordion,
  ListGroup,
  Badge,
  Form,
  Pagination,
  Stack,
  Button,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import {
  PeopleFill,
  PersonLinesFill,
  PersonBadgeFill,
  BuildingFill
} from 'react-bootstrap-icons';
import { firstWord, lastWord } from '../utils/stringUtils';

export default function SummaryCards() {
  const { employees } = useEmployees();
  const { teams }     = useTeams();

  const [modalType, setModalType]       = useState(null);
  const [agentPage, setAgentPage]       = useState(1);
  const [teamPage, setTeamPage]         = useState(1);
  const [searchAgents, setSearchAgents] = useState('');
  const [searchTeams, setSearchTeams]   = useState('');

  const [supActiveKeys, setSupActiveKeys] = useState([]);
  const [tlActiveKeys, setTlActiveKeys]   = useState([]);

  // reset pages when opening modals or search terms change
  useEffect(() => {
    if (modalType === 'agents') setAgentPage(1);
    if (modalType === 'teams')  setTeamPage(1);
  }, [modalType, searchAgents, searchTeams]);

  // sorted lists
  const supervisors = useMemo(
    () =>
      employees
        .filter(e => e.position === 'Supervisor')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [employees]
  );
  const teamLeads = useMemo(
    () =>
      employees
        .filter(e => e.position === 'Team Lead')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [employees]
  );
  const agents = useMemo(
    () =>
      employees
        .filter(e => e.position === 'Agent')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [employees]
  );
  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams]
  );

  // map managers to their teams
  const managerTeams = useMemo(() => {
    const map = {};
    supervisors.concat(teamLeads).forEach(mgr => {
      map[mgr.id] = teams.filter(t => t.supervisorId === mgr.id);
    });
    return map;
  }, [supervisors, teamLeads, teams]);

  // map agents to their assigned teams
  const agentTeams = useMemo(() => {
    const map = {};
    agents.forEach(agent => {
      map[agent.id] = teams.filter(t =>
        Array.isArray(t.memberRecords) &&
        t.memberRecords.some(r => r.employeeId === agent.id)
      );
    });
    return map;
  }, [agents, teams]);

  // pagination constants
  const AGENTS_PER_PAGE = 10;
  const TEAMS_PER_PAGE  = 10;

  // filtered & paginated agents
  const filteredAgents = useMemo(() => {
    const term = searchAgents.toLowerCase().trim();
    return term
      ? agents.filter(a => a.name.toLowerCase().includes(term))
      : agents;
  }, [agents, searchAgents]);
  const totalAgentPages = Math.max(1, Math.ceil(filteredAgents.length / AGENTS_PER_PAGE));
  const displayedAgents = filteredAgents.slice(
    (agentPage - 1) * AGENTS_PER_PAGE,
    agentPage * AGENTS_PER_PAGE
  );

  // filtered & paginated teams
  const filteredTeams = useMemo(() => {
    const term = searchTeams.toLowerCase().trim();
    return term
      ? sortedTeams.filter(t => t.name.toLowerCase().includes(term))
      : sortedTeams;
  }, [sortedTeams, searchTeams]);
  const totalTeamPages = Math.max(1, Math.ceil(filteredTeams.length / TEAMS_PER_PAGE));
  const displayedTeamsList = filteredTeams.slice(
    (teamPage - 1) * TEAMS_PER_PAGE,
    teamPage * TEAMS_PER_PAGE
  );

  // summary cards
  const cards = [
    {
      key: 'supervisors',
      title: 'Supervisors',
      count: supervisors.length,
      icon: <PeopleFill size={24} />,
    },
    {
      key: 'teamLeads',
      title: 'Team Leads',
      count: teamLeads.length,
      icon: <PersonLinesFill size={24} />,
    },
    {
      key: 'agents',
      title: 'Agents',
      count: agents.length,
      icon: <PersonBadgeFill size={24} />,
    },
    {
      key: 'teams',
      title: 'CIE',
      count: teams.length,
      icon: <BuildingFill size={24} />,
    },
  ];

    const handleAccordionToggle = (id, openList, setOpenList) => {
    setOpenList(prev =>
      prev.includes(id)
        ? prev.filter(k => k !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <Row className="g-3 mb-4">
        {cards.map(({ key, title, count, icon }) => (
          <Col key={key} xs={6} md={3}>
            <Card
              bg="light"
              className="h-100"
              style={{ cursor: 'pointer' }}
              onClick={() => setModalType(key)}
            >
              <Card.Body className="d-flex align-items-center">
                <div className="me-3">{icon}</div>
                <div>
                  <Card.Title className="mb-0">{count}</Card.Title>
                  <Card.Text className="small text-uppercase">
                    {title}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Supervisors Modal */}
      <Modal
        show={modalType === 'supervisors'}
        onHide={() => setModalType(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Supervisors</Modal.Title>
            <Button
                variant="outline-secondary"
                size="sm"
                className="ms-auto"
                onClick={() => setSupActiveKeys(supervisors.map(s => s.id))}
              >
                Expand All
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                className="ms-2"
                onClick={() => setSupActiveKeys([])}
              >
                Collapse All
              </Button>

        </Modal.Header>
        <Modal.Body>
         <Accordion
            flush
            alwaysOpen
            activeKey={supActiveKeys}
            onSelect={key => {
              setSupActiveKeys(prev =>
                prev.includes(key)
                  ? prev.filter(k => k !== key)
                  : [...prev, key]
              );
            }}
          >
            {supervisors.map(sup => (
              <Accordion.Item eventKey={sup.id} key={sup.id}>
                <Accordion.Header
                   onClick={() =>
                   handleAccordionToggle(sup.id, supActiveKeys, setSupActiveKeys)
                 }
                >
                  <div>
                    <strong>{sup.name}</strong>
                    <Badge bg="secondary" className="ms-3">
                      {managerTeams[sup.id]?.length || 0} CIE
                    </Badge>
                  </div>
            
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {(managerTeams[sup.id] || []).map(team => (
                      <ListGroup.Item
                        key={team.id}
                        className="d-flex justify-content-between"
                      >
                        {team.name}
                        <Badge bg="secondary">
                          {(team.memberRecords?.length) || 0} agents
                        </Badge>
                      </ListGroup.Item>
                    ))}
                    {!(managerTeams[sup.id] || []).length && (
                      <div className="text-muted">No teams</div>
                    )}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Modal.Body>
      </Modal>

      {/* Team Leads Modal */}
      <Modal
        show={modalType === 'teamLeads'}
        onHide={() => setModalType(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Team Leads</Modal.Title>
          <Button
            variant="outline-secondary"
            size="sm"
            className="ms-auto"
            onClick={() => setTlActiveKeys(teamLeads.map(s => s.id))}
          >
            Expand All
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            className="ms-2"
            onClick={() => setTlActiveKeys([])}
          >
            Collapse All
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Accordion
            flush
            alwaysOpen
            activeKey={tlActiveKeys}
            onSelect={key => {
              setTlActiveKeys(prev =>
                prev.includes(key)
                  ? prev.filter(k => k !== key)
                  : [...prev, key]
              );
            }}
          >
            {teamLeads.map(tl => (
              <Accordion.Item eventKey={tl.id} key={tl.id}>
                <Accordion.Header
                   onClick={() =>
                   handleAccordionToggle(tl.id, tlActiveKeys, setTlActiveKeys)
                 }
                >
                  <div>
                  <strong>{tl.name}</strong>
                    <Badge bg="secondary" className="ms-3">
                      {managerTeams[tl.id]?.length || 0} CIE
                    </Badge>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {(managerTeams[tl.id] || []).map(team => (
                      <ListGroup.Item
                        key={team.id}
                        className="d-flex justify-content-between"
                      >
                        {team.name}
                        <Badge bg="secondary">
                          {(team.memberRecords?.length) || 0} agents
                        </Badge>
                      </ListGroup.Item>
                    ))}
                    {!(managerTeams[tl.id] || []).length && (
                      <div className="text-muted">No teams</div>
                    )}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Modal.Body>
      </Modal>

      {/* Agents Modal */}
      <Modal
        show={modalType === 'agents'}
        onHide={() => setModalType(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Agents & Assignments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Search agents..."
            size="sm"
            className="mb-3"
            value={searchAgents}
            onChange={e => setSearchAgents(e.target.value)}
          />
          <ListGroup variant="flush">
            {displayedAgents.map(agent => (
              <ListGroup.Item
                key={agent.id}
                className="d-flex justify-content-between align-items-start"
              >
                <strong>{agent.name}</strong>
                <Stack direction="horizontal" gap={1}>
                  {(agentTeams[agent.id] || []).map(team => {
                    const sup = employees.find(e => e.id === team.supervisorId);
                    return (
                      <Badge key={team.id} bg="info">
                        {team.name}{sup ? ` (${firstWord(sup.name)})` : ''}
                      </Badge>
                    );
                  })}
                  {!agentTeams[agent.id]?.length && (
                    <Badge bg="secondary">Unassigned</Badge>
                  )}
                </Stack>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Pagination className="justify-content-center mt-3">
            <Pagination.Prev
              disabled={agentPage === 1}
              onClick={() => setAgentPage(p => Math.max(p - 1, 1))}
            />
            {[...Array(totalAgentPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={agentPage === i + 1}
                onClick={() => setAgentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={agentPage === totalAgentPages}
              onClick={() => setAgentPage(p => Math.min(p + 1, totalAgentPages))}
            />
          </Pagination>
        </Modal.Body>
      </Modal>

      {/* Teams Modal */}
      <Modal
        show={modalType === 'teams'}
        onHide={() => setModalType(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>CIE List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Search teams..."
            size="sm"
            className="mb-3"
            value={searchTeams}
            onChange={e => setSearchTeams(e.target.value)}
          />
          <ListGroup variant="flush">
            {displayedTeamsList.map(team => {
              const sup = employees.find(e => e.id === team.supervisorId);
             const agentNames = (team.memberRecords || [])
                .map(r => {
                  const emp = employees.find(e => e.id === r.employeeId);
                  const empFullName = emp ?  firstWord(emp.name) + " " + lastWord(emp.name) : null;
                  return empFullName;
                })
                .filter(Boolean);
              return (
                <ListGroup.Item
                  key={team.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <strong>{team.name}</strong>
                  <Stack direction="horizontal" gap={1}>
                    <OverlayTrigger
                      placement="top"

                      overlay={
                        <Tooltip
                          id={`tooltip-agents-${team.id}`}
                          style={{ whiteSpace: 'pre-line'}}
                        >
                          {agentNames.length
                            ? agentNames.join(',\n ')
                            : 'No agents'}
                        </Tooltip>
                      }
                    >
                      <Badge bg="secondary">
                        {(team.memberRecords?.length) || 0} agents
                      </Badge>
                    </OverlayTrigger>
                    <Badge bg="info">
                      {sup ? firstWord(sup.name) : '—'}
                    </Badge>
                  </Stack>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          <Pagination className="justify-content-center mt-3">
            <Pagination.Prev
              disabled={teamPage === 1}
              onClick={() => setTeamPage(p => Math.max(p - 1, 1))}
            />
            {[...Array(totalTeamPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={teamPage === i + 1}
                onClick={() => setTeamPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={teamPage === totalTeamPages}
              onClick={() => setTeamPage(p => Math.min(p + 1, totalTeamPages))}
            />
          </Pagination>
        </Modal.Body>
      </Modal>
    </>
  );
}
