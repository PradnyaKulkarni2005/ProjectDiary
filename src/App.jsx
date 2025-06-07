import { Routes, Route } from 'react-router-dom';  // no BrowserRouter here
import Rubric1 from './pages/Rubric1';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Rubric2 from './pages/Rubric2';
import Rubric3 from './pages/Rubric3';
import Rubric4 from './pages/Rubric4';
import COProjectTable from './pages/COProjectTable';
import POPage from './pages/POPage';
import PSOPage from './pages/PSOPage';
import GuideDashboard from './pages/GuideDashboard';
import ProjectGroupPage from './pages/ProjectGroupPage';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/rubrics1" element={<Rubric1 />} />
        <Route path="/rubrics2" element={<Rubric2 />} />
        <Route path="/rubrics3" element={<Rubric3 />} />
        <Route path="/rubrics4" element={<Rubric4 />} />
        <Route path="/mechanical" element={<COProjectTable />} />
        <Route path="/po" element={<POPage />} />
        <Route path="/pso" element={<PSOPage />} />
        <Route path="/guide-dashboard" element={<GuideDashboard />} />
        <Route path="/project-dashboard" element={<ProjectGroupPage />} />
        
      </Routes>
    </>
  );
}

export default App;
