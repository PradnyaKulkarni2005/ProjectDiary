// src/components/GuidePreferences.js
import React, { useEffect, useState } from 'react';
import './GuidePreferences.css';
import {fetchGuidesByDepartment,submitGuidePreferences} from '../api';

export default function GuidePreferences({ groupId, department, onSubmitted }) {
  const [guides, setGuides] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await fetchGuidesByDepartment(department);
        const data = await res.json();
        setGuides(data.guides || []);
      } catch (err) {
        console.error('Error fetching guides:', err);
        alert('Failed to load guides.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [department]);

  const togglePreference = (guideId) => {
    setPreferences((prev) => {
      if (prev.includes(guideId)) {
        return prev.filter((id) => id !== guideId);
      } else if (prev.length < 3) {
        return [...prev, guideId];
      } else {
        alert('You can select exactly 3 preferences only.');
        return prev;
      }
    });
  };

  const handleSubmit = async () => {
    if (preferences.length !== 3) {
      alert('Please select exactly 3 guide preferences.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitGuidePreferences({ groupId, preferences });
        if (!res || !res.guides) {
            throw new Error('Invalid response from server');
        }
        // Handle successful submission
        alert('Guide preferences submitted successfully!');
        // Optionally, you can reset preferences or navigate back
        setPreferences([]);

        // Notify parent component (e.g., return to dashboard)
        if (onSubmitted) {
          onSubmitted();
        }
        } catch (err) {
      console.error('Error submitting preferences:', err);
        alert('Failed to submit preferences. Please try again.');
        // Optionally, you can handle specific error messages here
        return;
    }
  };

  if (loading) return <div>Loading guide list...</div>;

  return (
    <div className="guide-preferences-container">
      <h2>Select 3 Guide Preferences</h2>
      <ul className="guide-list">
        {guides.map((guide) => (
          <li
            key={guide.id}
            className={`guide-item ${preferences.includes(guide.id) ? 'selected' : ''}`}
            onClick={() => togglePreference(guide.id)}
          >
            {guide.name} ({guide.email})
            {preferences.includes(guide.id) && (
              <span className="preference-tag">
                #{preferences.indexOf(guide.id) + 1}
              </span>
            )}
          </li>
        ))}
      </ul>

      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Preferences'}
      </button>
    </div>
  );
}
