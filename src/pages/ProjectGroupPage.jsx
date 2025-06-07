import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProjectGroupPage.css';

function ProjectGroupPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState('');
  const [outcomes, setOutcomes] = useState('');
  const [discussion, setDiscussion] = useState('');
  const [meeting, setMeeting] = useState('');

  return (
    <div className="form project-form">
      <h2 className="form-title">Project Group {groupId}</h2>

      <div className="flex-column">
        <label>To Do:</label>
        <textarea className="input textarea" value={todo} onChange={e => setTodo(e.target.value)} placeholder="Enter tasks..." />
      </div>

      <div className="flex-column">
        <label>Outcomes:</label>
        <textarea className="input textarea" value={outcomes} onChange={e => setOutcomes(e.target.value)} placeholder="Expected outcomes..." />
      </div>

      <div className="flex-column">
        <label>Discussion:</label>
        <textarea className="input textarea" value={discussion} onChange={e => setDiscussion(e.target.value)} placeholder="Discussion notes..." />
      </div>

      <div className="flex-column">
        <label>Next Meeting Schedule:</label>
        <input className="input" type="datetime-local" value={meeting} onChange={e => setMeeting(e.target.value)} />
      </div>

      <button className="button-submit" onClick={() => navigate(-1)}>← Back to Dashboard</button>
    </div>
  );
}

export default ProjectGroupPage;