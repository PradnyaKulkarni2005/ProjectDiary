// frontend/src/components/ReviewEvaluation.js
import React, { useState, useEffect } from "react";
import styles from "./Evaluation.module.css";
import { addReviewAssessment, getReviewsByTeam } from "../api";

const reviewsData = [
  {
    id: 1,
    stage_number: 1,
    review_number: "Review1",
    stage: "Stage 1: Review 1",
    agenda: "Synopsis, Problem definition identification",
    maxMarks: 30,
    weightage: "15%",
    coCovered: "CO1, CO2, CO5",
  },
  {
    id: 2,
    stage_number: 1,
    review_number: "Review2",
    stage: "Stage 1: Review 2",
    agenda: "Design finalization",
    maxMarks: 70,
    weightage: "35%",
    coCovered: "CO2, CO3, CO4, CO5",
  },
  {
    id: 3,
    stage_number: 2,
    review_number: "Review1",
    stage: "Stage 2: Review 1",
    agenda: "Manufacturing, result validation",
    maxMarks: 30,
    weightage: "15%",
    coCovered: "CO1, CO3, CO4, CO5",
  },
  {
    id: 4,
    stage_number: 2,
    review_number: "Review2",
    stage: "Stage 2: Review 2",
    agenda: "Demonstration and report writing",
    maxMarks: 70,
    weightage: "35%",
    coCovered: "CO1, CO3, CO4, CO5, CO6",
  },
];

export default function ReviewEvaluation({ groupId }) {
  // initialize with empty marks/comments
  const initialMarks = reviewsData.reduce((acc, review) => {
    acc[`${review.stage_number}-${review.review_number}`] = "";
    return acc;
  }, {});
  const initialComments = reviewsData.reduce((acc, review) => {
    acc[`${review.stage_number}-${review.review_number}`] = "";
    return acc;
  }, {});

  const [marks, setMarks] = useState(initialMarks);
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ fetch existing reviews for this group (stage-wise)
 
  useEffect(() => {
  const fetchReviews = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      
      
      // Make sure to access the array inside the 'data' property
      const reviews = await getReviewsByTeam(groupId); // this should be an array

      if (!Array.isArray(reviews)) {
        console.error("Expected reviews to be an array, got:", reviews);
        return;
      }

      const marksData = {};
      const commentsData = {};

      reviews.forEach((review) => {
        const key = `${review.stage_number}-${review.review_number}`;
        marksData[key] = review.marks;
        commentsData[key] = review.comments || "";
      });

      setMarks((prev) => ({ ...prev, ...marksData }));
      setComments((prev) => ({ ...prev, ...commentsData }));
    } catch (err) {
      console.error("❌ Failed to load previous reviews:", err);
    }
  };

  fetchReviews();
}, [groupId]);



  // ✅ handle marks input
  const handleMarksChange = (key, value, max) => {
    if (value === "" || (Number(value) >= 0 && Number(value) <= max)) {
      setMarks({ ...marks, [key]: value });
    }
  };

  // ✅ handle comment input
  const handleCommentChange = (key, value) => {
    setComments({ ...comments, [key]: value });
  };

  // ✅ calculate total marks
  const totalMarks = Object.values(marks).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );

  // ✅ save/update review
  const handleSubmit = async (review) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("⚠️ No token found. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const key = `${review.stage_number}-${review.review_number}`;

      const payload = {
        team_id: groupId,
        stage_number: review.stage_number,
        review_number: review.review_number, // "Review1" or "Review2"
        marks: marks[key],
        comments: comments[key],
      };

      await addReviewAssessment(payload, token);

      setMessage(`✅ Saved ${review.stage} successfully!`);
    } catch (error) {
      console.error("Error saving review:", error);
      setMessage("❌ Failed to save review. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.sectionContainer}>
      <h2>Review Evaluations for Group {groupId}</h2>

      {message && <div className={styles.alert}>{message}</div>}

      {/* Group reviews by stage */}
      {[1, 2].map((stage) => (
        <div key={stage} className={styles.stageSection}>
          <h2 className={styles.stageHeading}>Stage {stage}</h2>
          <div className={styles.reviews}>
            {reviewsData
              .filter((review) => review.stage_number === stage)
              .map((review) => {
                const key = `${review.stage_number}-${review.review_number}`;
                return (
                  <div key={review.id} className={styles.reviewCard}>
                    <h3>{review.stage}</h3>
                    <p>
                      <strong>Agenda:</strong> {review.agenda}
                    </p>
                    <p>
                      <strong>Max Marks:</strong> {review.maxMarks} |{" "}
                      <strong>Weightage:</strong> {review.weightage}
                    </p>
                    <p>
                      <strong>CO Covered:</strong> {review.coCovered}
                    </p>

                    {/* Marks Input */}
                    <input
                      type="number"
                      placeholder={`Out of ${review.maxMarks}`}
                      value={marks[key]}
                      onChange={(e) =>
                        handleMarksChange(key, e.target.value, review.maxMarks)
                      }
                      className={styles.inputBox}
                    />

                    {/* Comment Box */}
                    <textarea
                      placeholder="Enter comments..."
                      value={comments[key]}
                      onChange={(e) =>
                        handleCommentChange(key, e.target.value)
                      }
                      className={styles.textArea}
                    />

                    {/* Save Button */}
                    <button
                      onClick={() => handleSubmit(review)}
                      className={styles.saveButton}
                      disabled={loading || marks[key] === ""}
                    >
                      {loading ? "Saving..." : "Save Review"}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      <div className={styles.totalMarks}>
        Total Marks: {totalMarks} / 200
      </div>
    </div>
  );
}
