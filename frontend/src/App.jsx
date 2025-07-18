import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Only use Routes and Route

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
// import SupabaseTestPage from './pages/Supabase'; // fix path if needed

import Rubric1 from './pages/Rubric1';
import Rubric2 from './pages/Rubric2';
import Rubric3 from './pages/Rubric3';
import Rubric4 from './pages/Rubric4';
import COProjectTable from './pages/COProjectTable';
import POPage from './pages/POPage';
import PSOPage from './pages/PSOPage';
import GuideDashboard from './Guide/GuideDashboard';
import ProjectGroupPage from './pages/ProjectGroupPage';
import StudentDashboard from './Student/StudentDashboard';
import Registeration from './pages/RegisterPage';
// import GuideDashboard2 from './Guide/GuideDashboard';

function App() {
  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login/*" element={<LoginPage />} />
        
        <Route path="/coordinator-dashboard" element={<CoordinatorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/rubrics1" element={<Rubric1 />} />
        <Route path="/rubrics2" element={<Rubric2 />} />
        <Route path="/rubrics3" element={<Rubric3 />} />
        <Route path="/rubrics4" element={<Rubric4 />} />
        <Route path="/mechanical" element={<COProjectTable />} />
        <Route path="/po" element={<POPage />} />
        <Route path="/pso" element={<PSOPage />} />
        <Route path="/guide-dashboard" element={<GuideDashboard />} />
        <Route path="/project-dashboard" element={<ProjectGroupPage />} />
        <Route path="/register" element={<Registeration />} />
        {/* <Route path="/test-supabase" element={<SupabaseTestPage />} /> */}

        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;
