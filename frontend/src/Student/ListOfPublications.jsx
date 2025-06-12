import React, { useState } from 'react';
import './ListOfPublications.css';

export default function ListOfPublications() {
  const [activeTab, setActiveTab] = useState('international');
  const [formData, setFormData] = useState({
    title: '',
    journal: '',
    volume: '',
    issue: '',
    page: '',
    year: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="publications-container">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'international' ? 'active' : ''}`}
          onClick={() => setActiveTab('international')}
        >
          International Journal
        </button>
        <button
          className={`tab-button ${activeTab === 'conference' ? 'active' : ''}`}
          onClick={() => setActiveTab('conference')}
        >
          Conference Publication
        </button>
      </div>

      <div className="form-section">
        <h2 className="section-title">
          {activeTab === 'international' ? 'International Journal' : 'Conference Publication'}
        </h2>

        <label className="input-label">Title of the Paper</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter paper title"
        />

        <label className="input-label">Name of the Journal</label>
        <input
          type="text"
          name="journal"
          value={formData.journal}
          onChange={handleChange}
          placeholder="Enter journal name"
        />

        <label className="input-label">Volume Number</label>
        <input
          type="text"
          name="volume"
          value={formData.volume}
          onChange={handleChange}
          placeholder="Enter volume number"
        />

        <label className="input-label">Issue Number</label>
        <input
          type="text"
          name="issue"
          value={formData.issue}
          onChange={handleChange}
          placeholder="Enter issue number"
        />

        <label className="input-label">Page Number</label>
        <input
          type="text"
          name="page"
          value={formData.page}
          onChange={handleChange}
          placeholder="Enter page number"
        />

        <label className="input-label">Year of Publication</label>
        <input
          type="text"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Enter year of publication"
        />
      </div>
    </div>
  );
}
