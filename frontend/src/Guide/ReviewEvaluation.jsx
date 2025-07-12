import React from 'react';
import './GuideSection.css';

export default function ReviewEvaluation({ groupId }) {
  return (
    <div className="section-container">
      <h2>Review Evaluations for Group {groupId}</h2>
      <div className="reviews">
        {[1, 2, 3].map((review) => (
          <div key={review} className="review-card">
            <h3>Review {review}</h3>
            <p>Evaluation inputs and scores for Review {review}.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
