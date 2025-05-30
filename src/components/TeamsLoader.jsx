// src/components/OrgChartSkeleton.jsx
import React from "react";
import { Placeholder, Row, Col, Card, Stack } from "react-bootstrap";

export default function TeamsLoader() {
  return (
    <>
      {/* SummaryCards skeleton */}
      <Placeholder as={Row} animation="glow" className="mb-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Col key={idx} xs={6} md={3}>
            <Card className="h-100">
              <Card.Body>
                <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={4} />
                </Placeholder>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Placeholder>

      {/* Filter chips skeleton */}
      <Card className="mb-3">
        <Card.Body>
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Placeholder.Button
                key={idx}
                variant="secondary"
                xs={3}
                size="sm"
                className="rounded-pill"
              />
            ))}
          </Stack>
        </Card.Body>
      </Card>

      {/* Org chart grid skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="p-3">
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={4} />
            </Placeholder>
          </Card>
        ))}
      </div>
    </>
  );
}
