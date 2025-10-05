import React, { useState, useEffect } from "react";
import styles from "./Evaluation.module.css";
import { addReviewAssessment, updateReviewAssessment, getMyReviews } from "../api";

const reviewsData = [
  { id: 1, stage_number: 1, review_number: "Review1", stage: "Stage 1: Review 1", agenda: "Synopsis, Problem definition identification", maxMarks: 30, weightage: "15%", coCovered: "CO1, CO2, CO5" },
  { id: 2, stage_number: 1, review_number: "Review2", stage: "Stage 1: Review 2", agenda: "Design finalization", maxMarks: 70, weightage: "35%", coCovered: "CO2, CO3, CO4, CO5" },
  { id: 3, stage_number: 2, review_number: "Review1", stage: "Stage 2: Review 1", agenda: "Manufacturing, result validation", maxMarks: 30, weightage: "15%", coCovered: "CO1, CO3, CO4, CO5" },
  { id: 4, stage_number: 2, review_number: "Review2", stage: "Stage 2: Review 2", agenda: "Demonstration and report writing", maxMarks: 70, weightage: "35%", coCovered: "CO1, CO3, CO4, CO5, CO6" },
];

export default function ReviewEvaluationGuide({ groupId }) {
  const [marks, setMarks] = useState({});
  const [comments, setComments] = useState({});
  const [reviewIds, setReviewIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // fetch existing reviews for this specific group
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews = await getMyReviews(groupId); // 🔥 pass groupId to API
        const marksData = {};
        const commentsData = {};
        const idData = {};

        reviews.forEach((review) => {
          const key = `${review.stage_number}-${review.review_number}`;
          marksData[key] = review.marks;
          commentsData[key] = review.comments || "";
          idData[key] = review.id;
        });

        setMarks(marksData);
        setComments(commentsData);
        setReviewIds(idData);
      } catch (err) {
        console.error("❌ Failed to load reviews:", err);
        setMessage("❌ Failed to load reviews.");
      }
    };
    if (groupId) fetchReviews();
  }, [groupId]);

  const handleMarksChange = (key, value, max) => {
    if (value === "" || (Number(value) >= 0 && Number(value) <= max)) {
      setMarks({ ...marks, [key]: value });
    }
  };

  const handleCommentChange = (key, value) => {
    setComments({ ...comments, [key]: value });
  };

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
        group_id: groupId, // 🔥 attach correct group id
        stage_number: review.stage_number,
        review_number: review.review_number,
        marks: marks[key],
        comments: comments[key],
      };

      if (reviewIds[key]) {
        // update existing
        await updateReviewAssessment(reviewIds[key], payload, token);
        setMessage(`✅ Updated ${review.stage} for Group ${groupId} successfully!`);
      } else {
        // create new
        const saved = await addReviewAssessment(payload, token);
        setReviewIds({ ...reviewIds, [key]: saved.id });
        setMessage(`✅ Saved ${review.stage} for Group ${groupId} successfully!`);
      }
    } catch (error) {
      console.error("❌ Error saving review:", error);
      setMessage("❌ Failed to save review. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalMarks = Object.values(marks).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );

  return (
    <div className={styles.sectionContainer}>
      <h2>Review Evaluations (Guide) - Group {groupId}</h2>
      {message && <div className={styles.alert}>{message}</div>}

      {[1, 2].map((stage) => (
        <div key={stage} className={styles.stageSection}>
          <h2 className={styles.stageHeading}>Stage {stage}</h2>
          <div className={styles.reviews}>
            {reviewsData
              .filter((r) => r.stage_number === stage)
              .map((review) => {
                const key = `${review.stage_number}-${review.review_number}`;
                return (
                  <div key={review.id} className={styles.reviewCard}>
                    <h3>{review.stage}</h3>
                    <p><strong>Agenda:</strong> {review.agenda}</p>
                    <p><strong>Max Marks:</strong> {review.maxMarks} | <strong>Weightage:</strong> {review.weightage}</p>
                    <p><strong>CO Covered:</strong> {review.coCovered}</p>

                    <input
                      type="number"
                      placeholder={`Out of ${review.maxMarks}`}
                      value={marks[key] || ""}
                      onChange={(e) =>
                        handleMarksChange(key, e.target.value, review.maxMarks)
                      }
                      className={styles.inputBox}
                    />

                    <textarea
                      placeholder="Enter comments..."
                      value={comments[key] || ""}
                      onChange={(e) => handleCommentChange(key, e.target.value)}
                      className={styles.textArea}
                    />

                    <button
                      onClick={() => handleSubmit(review)}
                      className={styles.saveButton}
                      disabled={loading || marks[key] === ""}
                    >
                      {loading ? "Saving..." : reviewIds[key] ? "Update" : "Save"}
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
