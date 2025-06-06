// import React, { useState } from 'react';
// import './Navbar.css';

// function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   return (
//     <header className="navbar-container">
//       <div className="top-header">
//         <img src="src/assets/logo.jpeg" alt="PCCOE Logo" className="logo" />

//         <div className="logo-title">
//           <h1>PCET Trust’s</h1>
//           <h2>Pimpri Chinchwad College Of Engineering, Pune</h2>
//           <h3>Nigdi Pradhikaran, Sector 26, 411044</h3>
//         </div>

//         <img src="src/assets/logo2.png" alt="25 Years Logo" className="logo25" />
//       </div>

//       <nav className="main-nav">
//         <button
//           className={`hamburger ${menuOpen ? 'open' : ''}`}
//           onClick={toggleMenu}
//           aria-label="Toggle menu"
//           aria-expanded={menuOpen}
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </button>

//         <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
//           <div className="nav-item"><a href="#">Home</a></div>

//           <div className="dropdown">
//             <button className="dropbtn">Department ▾</button>
//             <div className="dropdown-content">
//               <a href="#">Computer Science</a>
//               <a href="#">Information Technology</a>
//               <a href="#">Civil</a>
//               <a href="#">Mechanical</a>
//               <a href="#">AIML</a>
//               <a href="#">CS Regional</a>
//             </div>
//           </div>

//           <div className="dropdown">
//             <button className="dropbtn">Rubrics ▾</button>
//             <div className="dropdown-content">
//               <a href="#">Rubrics 1</a>
//               <a href="#">Rubrics 2</a>
//               <a href="#">Rubrics 3</a>
//               <a href="#">Rubrics 4</a>
//               <a href="#">Rubrics 5</a>
//               <a href="#">Rubrics 6</a>
//             </div>
//           </div>

//           <div className="dropdown">
//             <button className="dropbtn">Login ▾</button>
//             <div className="dropdown-content">
//               <a href="/login?role=guide">Guide</a>
//               <a href="/login?role=coordinator">Project Coordinator</a>
//               <a href="/login?role=student">Student</a>
//               <a href="/login?role=hod">HOD</a>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

// export default Navbar;
// src/components/Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="navbar-container">
      <div className="top-header">
        <img src="src/assets/logo.jpeg" alt="PCCOE Logo" className="logo" />
        <div className="logo-title">
          <h1>PCET Trust’s</h1>
          <h2>Pimpri Chinchwad College Of Engineering, Pune</h2>
          <h3>Nigdi Pradhikaran, Sector 26, 411044</h3>
        </div>
        <img src="src/assets/logo2.png" alt="25 Years Logo" className="logo25" />
      </div>

      <nav className="main-nav">
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <div className="nav-item"><a href="/">Home</a></div>

          <div className="dropdown">
            <button className="dropbtn">Department ▾</button>
            <div className="dropdown-content">
              <a href="#">Computer Science</a>
              <a href="">Information Technology</a>
               <Link to="/po">Programme Outcomes (PO's)</Link>
              <a href="#">Civil</a>
              <Link to="/mechanical">Mechanical</Link>
              <a href="#">AIML</a>
              <a href="#">CS Regional</a>
            </div>
          </div>

          <div className="dropdown">
            <button className="dropbtn">Rubrics ▾</button>
            <div className="dropdown-content">
              <Link to="/rubrics1">Rubrics 1</Link>
              <Link to="/rubrics2">Rubrics 2</Link>
              <Link to="/rubrics3">Rubrics 3</Link>
              <Link to="/rubrics4">Rubrics 4</Link>
              <Link to="/rubrics1">Rubrics 5</Link>
              <Link to="/rubrics1">Rubrics 6</Link>
            </div>
          </div>

          <div className="dropdown">
            <button className="dropbtn">Login ▾</button>
            <div className="dropdown-content">
              <a href="/login?role=guide">Guide</a>
              <a href="/login?role=coordinator">Project Coordinator</a>
              <a href="/login?role=student">Student</a>
              <a href="/login?role=hod">HOD</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
