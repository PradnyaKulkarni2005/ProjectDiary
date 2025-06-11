import React, { useState } from 'react';
import './Patents.css';

export default function Patents() {
  const [patents, setPatents] = useState([
    {
      title: '',
      patentNumber: '',
      applicationNumber: '',
      inventors: '',
      filingDate: '',
      status: 'Filed',
      office: '',
      description: '',
    },
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...patents];
    updated[index][name] = value;
    setPatents(updated);
  };

  const addPatent = () => {
    setPatents([
      ...patents,
      {
        title: '',
        patentNumber: '',
        applicationNumber: '',
        inventors: '',
        filingDate: '',
        status: 'Filed',
        office: '',
        description: '',
      },
    ]);
  };

  return (
    <div className="patents-container">
      <h2 className="section-title">Patent Details</h2>

      {patents.map((patent, index) => (
        <div key={index} className="patent-form animate-fade-in">
          <label>Title of the Patent</label>
          <input type="text" name="title" value={patent.title} onChange={(e) => handleChange(index, e)} />

          <label>Patent Number</label>
          <input type="text" name="patentNumber" value={patent.patentNumber} onChange={(e) => handleChange(index, e)} />

          <label>Application Number</label>
          <input type="text" name="applicationNumber" value={patent.applicationNumber} onChange={(e) => handleChange(index, e)} />

          <label>Inventors</label>
          <input type="text" name="inventors" value={patent.inventors} onChange={(e) => handleChange(index, e)} />

          <label>Filing Date</label>
          <input type="date" name="filingDate" value={patent.filingDate} onChange={(e) => handleChange(index, e)} />

          <label>Status</label>
          <select name="status" value={patent.status} onChange={(e) => handleChange(index, e)}>
            <option value="Filed">Filed</option>
            <option value="Published">Published</option>
            <option value="Granted">Granted</option>
            <option value="Rejected">Rejected</option>
          </select>

          <label>Patent Office</label>
          <input type="text" name="office" value={patent.office} onChange={(e) => handleChange(index, e)} />

          <label>Abstract / Description</label>
          <textarea name="description" value={patent.description} onChange={(e) => handleChange(index, e)} placeholder="Brief abstract of the invention..." />
        </div>
      ))}

      <button className="add-button" onClick={addPatent}>+ Add Another Patent</button>
    </div>
  );
}
