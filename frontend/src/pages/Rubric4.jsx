import React from "react";
import "./RubricTable.css";

const Rubric4 = () => {
  const data = [
    {
      criteria: "Demonstrate sound academic fundamentals to formulate and analyze complex Mechanical engineering problems. (out of 25)",
      excellent:
        "Demonstrates understanding of fundamentals and ability to formulate and analyze Mechanical engineering problems. (Problem statement is clearly defined.) (17–25)",
      good:
        "Demonstrates understanding of fundamentals but is not able to formulate and analyze Mechanical engineering problems. (Problem statement is not clearly defined.) (8–16)",
      poor:
        "Demonstrates poor understanding of fundamentals and is not able to formulate and analyze Mechanical engineering problems. (Problem statement is not defined.) (less than 8)",
    },
    {
      criteria: "Provide creative/innovative solutions for complex engineering problems. (out of 25)",
      excellent:
        "The proposed solution addresses the problem statement appropriately, and it also demonstrates creativity/innovativeness (creative/innovative solution is proposed) (17–25)",
      good:
        "The proposed solution addresses the problem statement appropriately, but it doesn’t demonstrate creativity/innovativeness (Ordinary solution is proposed) (8–16)",
      poor:
        "The proposed solution doesn’t address the problem statement appropriately (Solution is not proposed) (less than 8)",
    },
    {
      criteria:
        "Design Mechanical systems/products/processes for providing solutions to environmental issues/needs of society/Industry/safety issues. (out of 25)",
      excellent:
        "Demonstrates excellent understanding of engineering fundamentals to design Mechanical systems/products/processes and environmental issues/needs of society/Industry/safety issues are addressed (17–25)",
      good:
        "Demonstrates good understanding of engineering fundamentals to design Mechanical systems/products/processes, but environmental issues/needs of society/Industry/safety issues are not addressed. (8–16)",
      poor:
        "Demonstrates very poor understanding of design fundamentals and environmental issues/needs of society/Industry/safety issues. (less than 8)",
    },
    {
      criteria:
        "Apply modern modeling and simulation techniques/computing tools. (out of 25)",
      excellent:
        "Appropriate modeling /simulation techniques/computing tool is identified and used efficiently for design. (17–25)",
      good:
        "Appropriate modeling /simulation techniques/computing tool is identified but not used efficiently for design. (8–16)",
      poor:
        "Appropriate modeling /simulation techniques/computing tools not identified and used. (less than 8)",
    },
    {
      criteria:
        "Work effectively as a team member/Leader in order to manage the project work and finance. (out of 25)",
      excellent:
        "Demonstration of very good coordination among the team members with excellent work and financial management (17–25)",
      good:
        "Demonstrated average coordination among the team members with good work and financial management. (8–16)",
      poor:
        "Demonstration of poor coordination among the team members with poor work and financial management. (less than 8)",
    },
    {
      criteria:
        "Write a report on the research work and present it effectively. (out of 25)",
      excellent:
        "Well-organized project report, neatly dressed with confident body language, systematically and effectively presents the content with a clear understanding and ability to answer queries. (17–25)",
      good:
        "Well-organized project report, neatly dressed with confident body language. Presents content with clear understanding but lacks a systematic approach in presentation and is not able to answer queries (8–16)",
      poor:
        "Not well-organized project report, neatly dressed but low confidence and not able to present content clearly and not able to answer queries. (less than 8)",
    },
  ];

  return (
    <div className="rubric-container">
      <h1>Rubric 4: Final External examination of project work</h1>
      <p>Maximum Marks: 150</p>
      <div className="table-wrapper">
        <table className="rubric-table">
          <thead>
            <tr>
              <th>Criteria (CO)</th>
              <th>Excellent</th>
              <th>Good</th>
              <th>Poor</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.criteria}</td>
                <td>{row.excellent}</td>
                <td>{row.good}</td>
                <td>{row.poor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rubric4;
