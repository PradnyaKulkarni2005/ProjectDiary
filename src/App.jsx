import { Routes, Route } from 'react-router-dom';  // no BrowserRouter here
import Rubric1 from './pages/Rubric1';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Rubric2 from './pages/Rubric2';
import Rubric3 from './pages/Rubric3';
import Rubric4 from './pages/Rubric4';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/rubrics1" element={<Rubric1 />} />
        <Route path="/rubrics2" element={<Rubric2 />} />
        <Route path="/rubrics3" element={<Rubric3 />} />
        <Route path="/rubrics4" element={<Rubric4 />} />
        
        
      </Routes>
    </>
  );
}

export default App;
