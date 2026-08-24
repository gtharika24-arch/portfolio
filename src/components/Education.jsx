function Education() {
  const education = [
    {
      degree: "B.Tech in AI & Data Science",
      school: "Kongu Engineering College",
      cgpa: "7.69 / 10.0",
      year: "2023 - 2027"
    },
    {
      degree: "Specialization: Machine Learning & Web Development",
      school: "Focus Areas",
      cgpa: "Full Stack Development",
      year: "Data Science & AI"
    }
  ];

  const certifications = [
    "React Developer Certification",
    "Full Stack Web Development",
    "Python for Data Science",
    "Machine Learning Fundamentals"
  ];

  return (
    <section id="education">
      <h2>Education & Certifications</h2>
      <div className="education-grid">
        {education.map((edu, index) => (
          <div className="education-card" key={index}>
            <h3>{edu.degree}</h3>
            <p><strong>{edu.school}</strong></p>
            <p>{edu.cgpa}</p>
            <p className="education-year">{edu.year}</p>
          </div>
        ))}
      </div>

      <div className="certification-block">
        <h3 className="certification-title">Certifications</h3>
        <ul className="certification-list">
          {certifications.map((cert, index) => (
            <li key={index}>✓ {cert}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Education;