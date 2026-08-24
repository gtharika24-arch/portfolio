import { useEffect, useState } from 'react';
import './styles.css';
import ChessWidget from './components/ChessWidget';
import Contact from './components/Contact';
import MountainChessBackground from './components/MountainChessBackground';

const projects = [
  {
    title: 'School Manager',
    subtitle: 'Full-stack student operations platform',
    description:
      'Secure admin workflows with authentication, protected routes, and REST APIs for CRUD operations. Calendar, fee management, and offline-ready workflows make school administration calmer.',
    stack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'IndexedDB', 'PWA'],
  },
  {
    title: 'Water Level Monitoring System',
    subtitle: 'Real-time water and tank monitoring',
    description:
      'Tracks live tank status with alert-ready logic to prevent overflow and shortages. The project pairs a resilient data layer with a calm, practical interface.',
    stack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'IndexedDB', 'PWA'],
  },
  {
    title: 'BookMyStay',
    subtitle: 'Smart hotel reservation platform',
    description:
      'Search, reserve, and manage hotel bookings with automated confirmations and cancellations, designed to feel polished from first click to final booking.',
    stack: ['React.js', 'Node.js', 'Express.js', 'MySQL/MongoDB', 'REST APIs', 'Email Integration'],
  },
];

const skills = [
  {
    title: 'Languages',
    items: ['Python', 'Java', 'C', 'C++'],
  },
  {
    title: 'Frontend / Backend',
    items: ['React', 'HTML', 'CSS', 'Node.js', 'Express'],
  },
  {
    title: 'Tools & Database',
    items: ['Figma', 'Canva', 'VS Code', 'GitHub', 'MongoDB', 'MySQL'],
  },
  {
    title: 'Cloud',
    items: ['Render', 'Vercel'],
  },
];

const education = [
  {
    title: 'B.Tech Artificial Intelligence and Data Science',
    meta: 'Kongu Engineering College, Erode • 2026–Present • CGPA 7.69/10',
  },
  {
    title: 'HCL SRV Hi-Tech School',
    meta: '2024 • 83%',
  },
  {
    title: 'SSCL Emerald Valley Public School',
    meta: '2020 • 80%',
  },
];

const certifications = [
  'Advanced Programming in C (NPTEL)',
  'Deep Learning Certification (HCL Technologies)',
  'Java DSA Certification (Infosys)',
];

const achievements = [
  {
    title: 'EXODIA 2K26',
    detail: '2nd Prize • ISTE Student Chapter',
  },
  {
    title: "HACKHUB'26",
    detail: '24-hour Hackathon • Computer Society',
  },
];

const totalMoves = 30;
const moveMarkers = Array.from({ length: totalMoves }, (_, index) => index + 1);

function App() {
  const [activeMove, setActiveMove] = useState(0);

  useEffect(() => {
    const markers = Array.from(document.querySelectorAll('.scroll-marker'));
    if (!markers.length) return undefined;

    if (typeof window.IntersectionObserver === 'undefined') {
      const firstMove = Number(markers[0]?.dataset.move || 0);
      setActiveMove(firstMove);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveMove(Number(visible.target.dataset.move || 0));
        }
      },
      {
        threshold: [0.15, 0.3, 0.55, 0.8],
        rootMargin: '0px 0px -25% 0px',
      }
    );

    markers.forEach((marker) => observer.observe(marker));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-shell">
      <div className="background-layer" aria-hidden="true">
        <MountainChessBackground />
        <div className="background-overlay" />
      </div>
      <div className="scroll-marker-layer" aria-hidden="true">
        {moveMarkers.map((move) => (
          <div key={move} className="scroll-marker" data-move={move} style={{ top: `${(move / (moveMarkers.length + 1)) * 100}%` }} />
        ))}
      </div>

      <header className="hero section">
        <div className="hero-copy">
          <p className="eyebrow">Tharika G · Portfolio · Chess-inspired UI</p>
          <h1>Tharika G</h1>
          <h2>Full-stack developer · AI & Data Science student</h2>
          <p className="summary">
            I design and build thoughtful web experiences that balance product clarity, clean architecture, and a little bit of theatrical pacing.
          </p>
          <div className="hero-actions">
            <a href="/Tharika_G_Resume.pdf" download className="button primary">Download Resume</a>
            <a href="#contact" className="button secondary">Contact</a>
            <a href="#projects" className="button secondary">View Projects</a>
          </div>
          <p className="scroll-cue">Scroll to see the game unfold</p>
        </div>
        <div className="hero-motif" aria-hidden="true">
          <div className="motif-grid">
            {Array.from({ length: 64 }, (_, index) => {
              const file = index % 8;
              const rank = Math.floor(index / 8);
              const isDark = (file + rank) % 2 === 1;
              return <span key={index} className={`motif-cell ${isDark ? 'motif-cell--dark' : 'motif-cell--light'}`} />;
            })}
          </div>
        </div>
      </header>

      <main>
        <div className="section-divider" aria-hidden="true" />
        <section id="projects" className="section">
          <div className="section-heading">
            <p className="eyebrow">Selected work</p>
            <h3>Projects</h3>
          </div>
          <div className="card-grid">
            {projects.map((project) => (
              <article className="card" key={project.title}>
                <h4>{project.title}</h4>
                <p className="card-subtitle">{project.subtitle}</p>
                <p>{project.description}</p>
                <div className="chip-row">
                  {project.stack.map((item) => (
                    <span className="chip" key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />
        <section id="skills" className="section">
          <div className="section-heading">
            <p className="eyebrow">Core strengths</p>
            <h3>Skills</h3>
          </div>
          <div className="skills-grid">
            {skills.map((group) => (
              <div className="skills-card" key={group.title}>
                <h4>{group.title}</h4>
                <div className="chip-row">
                  {group.items.map((item) => (
                    <span className="chip" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />
        <section id="achievements" className="section">
          <div className="section-heading">
            <p className="eyebrow">Recognition</p>
            <h3>Achievements</h3>
          </div>
          <div className="card-grid achievement-grid">
            {achievements.map((item) => (
              <article className="card accent" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />
        <section id="education" className="section">
          <div className="section-heading">
            <p className="eyebrow">Academic path</p>
            <h3>Education & Certifications</h3>
          </div>
          <div className="timeline-list">
            {education.map((item, index) => (
              <div className="timeline-item" key={item.title}>
                <span className="timeline-index">0{index + 1}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cert-list">
            <h4>Certifications</h4>
            <ul>
              {certifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Contact />

      <ChessWidget activeMove={activeMove} totalMoves={totalMoves} />
    </div>
  );
}

export default App;