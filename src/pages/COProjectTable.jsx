import React from "react";
import "./RubricTable.css"; 

export default function COProjectTable() {
  const data = [
    {
      id: 1,
      statement:
        "Demonstrate sound academic fundamentals to formulate and analyze complex Mechanical engineering problems.",
      po: "1,2,3,4,5",
      pso: "1,2,3",
    },
    {
      id: 2,
      statement:
        "Provide creative/ innovative solutions for complex engineering problems.",
      po: "1,2,3,4,5,10,11,12",
      pso: "1,2,3",
    },
    {
      id: 3,
      statement:
        "Design Mechanical systems/products/processes for providing solutions to environmental issues/ needs of society/Industry/ safety issues.",
      po: "1,2,3,4,8,10",
      pso: "1,2,3",
    },
    {
      id: 4,
      statement:
        "Apply modern modeling and simulation techniques/ computing tools.",
      po: "4,5,12",
      pso: "1,2,3",
    },
    {
      id: 5,
      statement:
        "Work effectively as a team member / Leader in order to manage the project work and finance.",
      po: "6,7,9,11,12",
      pso: "3",
    },
    {
      id: 6,
      statement:
        "Write a report on the research work and present it effectively.",
      po: "6,7,9,11,12",
      pso: "3",
    },
  ];

  return (
    <div className="rubric-container">
      <h1>CO Statements for Project Work</h1>
      <div className="table-wrapper">
        <table className="rubric-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>CO Statement</th>
              <th>PO Mapped</th>
              <th>PSO Mapped</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.statement}</td>
                <td>{row.po}</td>
                <td>{row.pso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}