export default function Projects() {
  const projects = [
    {
      title: "School Manager",
      description:
        "Student Management System with React and MongoDB"
    },
    {
      title: "Water Level Monitoring",
      description:
        "IoT monitoring platform with real-time alerts"
    },
    {
      title: "BookMyStay",
      description:
        "Hotel booking application with email notifications"
    }
  ];

  return (
    <section id="projects">
      <h2>Projects</h2>

      <div className="project-grid">
        {projects.map((project) => (
          <div className="project-card" key={project.title}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}