import { motion } from "framer-motion";

export default function ProjectCard({
  title,
  description
}) {
  return (
    <motion.div
      className="project-card"
      whileHover={{
        rotateY: 20,
        rotateX: -10,
        scale: 1.05
      }}
    >
      <h3>{title}</h3>

      <p>{description}</p>
    </motion.div>
  );
}