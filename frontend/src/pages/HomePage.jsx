// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import './Home.css';
import bestproject1 from '../assets/bestproject1.jpeg';
import bestproject2 from '../assets/bestproject2.jpeg';
import bestproject3 from '../assets/bestproject3.jpeg';
import bestproject4 from '../assets/bestproject4.jpeg';
import bestproject5 from '../assets/bestproject5.jpeg';

const projects = [
  { img: bestproject1, title: "Smart Traffic System", desc: "IoT-based traffic management project by AIML Dept." },
  { img: bestproject2, title: "Smart Farming", desc: "Automated irrigation and crop monitoring system." },
  { img: bestproject3, title: "AI Proctoring", desc: "Face detection based online exam monitoring tool." },
  { img: bestproject4, title: "E-Waste Management", desc: "ML-based sorting and disposal system." },
  { img: bestproject5, title: "AR Learning App", desc: "Augmented Reality education app for kids." },
];

function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((prev) => (prev + 1) % projects.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const [openCard, setOpenCard] = useState(null);
const toggleCard = (index) => {
  setOpenCard(openCard === index ? null : index);
};

  return (
    <div className="homepage-container">
      <div className="ticker">
        <marquee>🚀 Welcome to Final Year Project Portal | PCCOE Pune | AY 2024–25</marquee>
      </div>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Final Year Project Management System</h1>
          <p>Digitally streamlining project submission, evaluation, and tracking for students and faculty.</p>
          <button className="hero-button">Explore Projects</button>
        </div>
      </section>

      <section className="carousel-section">
        <h2>⭐ Top Projects of AY 2023–24</h2>
        <div className="carousel-card">
          <img src={projects[current].img} alt={projects[current].title} />
          <div className="carousel-desc">
            <h4>{projects[current].title}</h4>
            <p>{projects[current].desc}</p>
          </div>
        </div>
      </section>

     <section className="features-flip-section">
  <h2>✨ Why Use This Portal?</h2>
  <div className="flip-grid">
    {[
      {
        front: "📑 Project Guidelines",
        back: "Step-wise process and documentation templates for students and guides."
      },
      {
        front: "📊 Rubrics Evaluation",
        back: "Auto-calculated scores with rubrics alignment for unbiased grading."
      },
      {
        front: "👨‍🏫 Central Collaboration",
        back: "Faculty, mentors and students working on the same platform with updates."
      }
    ].map((item, index) => (
      <div className="flip-card" key={index}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <h3>{item.front}</h3>
            <p>Hover to view more</p>
          </div>
          <div className="flip-card-back">
            <p>{item.back}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      <section className="timeline-section">
        <h2>📆 Project Milestone Timeline</h2>
        <ul className="timeline">
          <li><strong>July:</strong> Topic Selection</li>
          <li><strong>August:</strong> Abstract Submission</li>
          <li><strong>October:</strong> Progress Review 1</li>
          <li><strong>January:</strong> Progress Review 2</li>
          <li><strong>March:</strong> Final Submission</li>
        </ul>
      </section>

      <section className="about-contact">
        <div className="about">
          <h3>About Us</h3>
          <p>This portal is developed to bring transparency, consistency, and simplicity to final year project management across PCCOE departments.</p>
        </div>
        <div className="contact">
          <h3>Contact</h3>
          <p>Email: fyp-pcce@pccoe.com<br />Phone: +91-12345-67890</p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 PCCOE Pune. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;