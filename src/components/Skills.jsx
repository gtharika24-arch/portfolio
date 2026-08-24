const skills = [
  "React",
  "Node.js",
  "MongoDB",
  "Java",
  "Python",
  "Express",
  "MySQL",
  "GitHub"
];

export default function Skills() {
  return (
    <section id="skills">
      <h2>Skills</h2>
      <div className="skill-grid">
        {skills.map((skill) => (
          <div className="skill-card" key={skill}>
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
}