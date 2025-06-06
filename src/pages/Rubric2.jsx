import React from 'react';
import "./RubricTable.css";

export default function Rubric2() {
    const data = [
    {
      id: "a",
      title: "Study of data and Design calculations (25)",
      excellent:
        "Excellent clarity on data collection and design calculation. Covers all the aspects and assumptions. (17–25)",
      good:
        "Good clarity on data collection and design calculation. Covers 50% of aspects and assumptions. (8–16)",
      poor:
        "No clarity on data collection and design calculation. Does not cover any aspects or assumptions. (Less than 8)",
      co: "CO2, CO3",
    },
    {
      id: "b",
      title:
        "Modeling/System Design and Numerical Simulation /Mathematical model (20)",
      excellent:
        "Excellent study, implementation, analysis, and development of the model (14–20)",
      good:
        "Good study, implementation, analysis, and development of the model (6–13)",
      poor:
        "A poor study, incorrect implementation, analysis, and development of the model (Less than 6)",
      co: "CO3, CO4",
    },
    {
      id: "c",
      title: "Finalization of design/Model (20)",
      excellent: "Excellent design, which is production ready. (14–20)",
      good:
        "An appropriate design that is correct and satisfactory but needs small detailing/modification for production-ready design. (6–13)",
      poor:
        "A poor design that is not satisfactory and cannot be manufactured. (Less than 6)",
      co: "CO3, CO4",
    },
    {
      id: "d",
      title:
        "Individual contribution and completion of work referring to the set plan (10)",
      excellent:
        "Excellent contribution and completion of work. The student is able to demonstrate the work correctly and with fluency (7–10)",
      good:
        "Contribution is less, and the student is able to demonstrate only some of the work (4–6)",
      poor:
        "No contribution, and the student is not able to demonstrate the work (Less than 4)",
      co: "CO5",
    },
  ];
  return (
    <div className="rubric-container">
      <h1>Rubric 2: Assessment of Project Review 2 (TW Evaluation)</h1>
      <p>Maximum Marks: 75</p>
      <div className="table-wrapper">
        <table className="rubric-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Criteria</th>
              <th>Excellent</th>
              <th>Good</th>
              <th>Poor</th>
              <th>CO Mapping</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id.toUpperCase()}</td>
                <td>{row.title}</td>
                <td>{row.excellent}</td>
                <td>{row.good}</td>
                <td>{row.poor}</td>
                <td>{row.co}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}
