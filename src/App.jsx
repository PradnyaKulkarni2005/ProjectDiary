import { Routes, Route } from 'react-router-dom';  // no BrowserRouter here
import Rubric1 from './pages/Rubric1';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Rubric2 from './pages/Rubric2';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/rubrics1" element={<Rubric1 />} />
        <Route path="/rubrics2" element={<Rubric2 />} />
        
      </Routes>
    </>
  );
}

export default App;
