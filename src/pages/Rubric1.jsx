import React from "react";
import "./RubricTable.css";

const Rubric1 = () => {
  const data = [
    {
      id: "a",
      title: "Topic selection (15)",
      excellent: "Innovative and useful for society, Industry, or research (11–15)",
      good: "Somewhat innovative and useful for society, Industry, or research (5–10)",
      poor: "Useful for limited groups and not innovative (Less than 5)",
      co: "CO1",
    },
    {
      id: "b",
      title: "Problem Definition and Objectives (10)",
      excellent: "A selected problem statement is clear. It addresses the need and demonstrates creativity/innovativeness. (8–10)",
      good: "A problem statement written is appropriate which defines the topic/research area (4–7)",
      poor: "A problem statement written poorly defines the topic/research area. (Less than 4)",
      co: "CO1, CO2",
    },
    {
      id: "c",
      title: "Literature Survey (10)",
      excellent: "A detailed survey of useful sources like research papers, reports, books, etc., is carried out. (8–10)",
      good: "Identified some useful sources like research papers, reports, books, etc. (4–7)",
      poor: "Identified incorrect/very few sources. (Less than 4)",
      co: "CO1, CO2",
    },
    {
      id: "d",
      title: "Methodology (5)",
      excellent: "A clearly defined methodology that will satisfy all the objectives (4–5)",
      good: "The clearly defined methodology will satisfy 50% of the objective (2–3)",
      poor: "The poorly defined methodology which will not satisfy objectives (1)",
      co: "CO1",
    },
    {
      id: "e",
      title: "Project Planning and Expenditure (5)",
      excellent: "Detailed and extensive scheduling with timelines provided for each phase of a project. Work breakdown structure well defined. (4–5)",
      good: "Good scheduling of project. Work breakdown structure adequately defined. (2–3)",
      poor: "No project scheduling was done. No work breakdown structure was provided. (1)",
      co: "CO5",
    },
    {
      id: "f",
      title: "Individual contribution and completion of work refer to the set plan (5)",
      excellent: "Excellent contribution and completion of work. The student is able to demonstrate the work properly and with fluency (4–5)",
      good: "Contribution is less, and the student is able to demonstrate only some of the work (2–3)",
      poor: "No contribution and the student is not able to demonstrate the work (1)",
      co: "CO5",
    },
  ];

  return (
    <div className="rubric-container">
      <h1>Rubric 1: Assessment of Project Review 1 (TW Evaluation)</h1>
      <p>Maximum Marks: 50</p>
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
                <td>{row.id}</td>
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
  );
};

export default Rubric1;
