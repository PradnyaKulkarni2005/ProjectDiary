import React from "react";
import "./RubricTable.css";

const Rubric3 = () => {
  const data = [
    {
      id: "a",
      title: "Fabrication / Manufacturing of set up (20)",
      excellent:
        "Well-organized and complete manufacturing of test setup. (14–20)",
      good: "Sufficiently organized and partial completion of setup. (6–13)",
      poor: "Not manufactured (less than 6)",
      co: "CO3, CO5",
    },
    {
      id: "b",
      title: "Experimentation, Validation of Results, and conclusion (20)",
      excellent:
        "Clear result and conclusion, the excellent methodology adopted for experimentation (14–20)",
      good: "Partial validation of result and conclusion (6–13)",
      poor: "Incomplete result and conclusion (Less than 6)",
      co: "CO5",
    },
    {
      id: "c",
      title: "Report Writing (20)",
      excellent:
        "Written information that demonstrates an insightful, mature grasp of the text related to precise ideas, premises, or images from the literature. Organized report neat, easy-to-read content. Wrote all the report content using own words and key facts. (14–20)",
      good:
        "Written information that demonstrates an insightful, proficient grasp of the text related to reasonable, clear ideas, premises, or images from the literature. Organized reports, and most were neat and easy to read. Wrote most of the report content using own words and key facts. (6–13)",
      poor:
        "Wrote incomplete information that failed to demonstrate any research ideas or premises. Did not organize report; all content was messy and hard to read. Copied most or all of the notes word-for-word from the source. (less than 6)",
      co: "CO6",
    },
    {
      id: "d",
      title:
        "Individual contribution and completion of work referring to the set plan (15)",
      excellent:
        "Excellent contribution and completion of work. A student is able to demonstrate the work correctly and with fluency (11–15)",
      good:
        "Contribution is less, and the student is able to demonstrate only some of the work (5–10)",
      poor:
        "No Contribution and the student is not able to demonstrate the work (Less than 5)",
      co: "CO5",
    },
  ];

  return (
    <div className="rubric-container">
      <h1>Rubric 3: Assessment of Project Review 3 (TW Evaluation)</h1>
      <p>Maximum Marks: 75</p>
      <div className="table-wrapper">
        <table className="rubric-table">
          <thead>
            <tr>
              <th>Sr.no</th>
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
  );
};

export default Rubric3;
