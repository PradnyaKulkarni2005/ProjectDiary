import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './GuidePreferences.css';
import { fetchGuidesByUserId, submitGuidePreferences } from '../api';

export default function GuidePreferences({ groupId, onSubmitted }) {
  const [guides, setGuides] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // New states for project details
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('No userId found in localStorage');
        }

        const data = await fetchGuidesByUserId(userId);
        console.log('Fetched guides:', data);
        setGuides(data.guides || []);
      } catch (err) {
        console.error('Error fetching guides:', err);
        alert('Failed to load guides.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

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
    console.log('Submitting preferences:', preferences);
    try {
      const res = await submitGuidePreferences({
        groupId,
        preferences,
        teamName: showProjectForm && teamName ? teamName : null,
        projectTitle: showProjectForm && projectTitle ? projectTitle : null,
        description: showProjectForm && description ? description : null,
      });
      console.log('Submit response:', res);
      if (!res || !res.message) {
        throw new Error('Invalid response from server');
      }

      Swal.fire({
        icon: 'success',
        title: 'Preferences Submitted',
        text: 'Guide preferences submitted successfully!',
      });

      setPreferences([]);
      setTeamName('');
      setProjectTitle('');
      setDescription('');
      setShowProjectForm(false);

      if (onSubmitted) {
        onSubmitted();
      }
    } catch (err) {
      console.error('Error submitting preferences:', err);
      alert('Failed to submit preferences. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading guide list...</div>;

  return (
    <div className="guide-preferences-container">
      {!showProjectForm ? (
        <div className="project-choice">
          <h2>Project Details</h2>
          <p>You can skip this step or add details now.</p>
          <button className='submit' onClick={() => setShowProjectForm(true)}>Add Project Details</button>
          <button onClick={() => setShowProjectForm(false)}>Skip</button>
        </div>
      ) : (
        <div className="project-details-form">
          <h2>Enter Project Details</h2>
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Project Title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={() => setShowProjectForm(false)}>Cancel</button>
        </div>
      )}

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
