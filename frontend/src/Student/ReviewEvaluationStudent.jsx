import React, { useEffect, useState } from "react";
import { getMyReviews } from "../api";
import styles from "../Guide/Evaluation.module.css";

export default function ReviewEvaluationStudent() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getMyReviews();
        // Deduplicate by ID
        const uniqueReviews = Array.from(
          new Map(data.map((review) => [review.id, review])).values()
        );
        setReviews(uniqueReviews);
      } catch (err) {
        console.error("❌ Failed to load reviews:", err);
        setError("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.sectionContainer}>
      <h2>My Group Review Assessments</h2>
      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((r) => (
            <li key={r.id} className={styles.reviewCard}>
              <h3>
                Stage {r.stage_number} – {r.review_number}
              </h3>
              <p><strong>Marks:</strong> {r.marks}</p>
              <p><strong>Comments:</strong> {r.comments}</p>
              <p>
                <strong>Guide:</strong> {r.guide_name} ({r.guide_email})
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(r.assessment_date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
