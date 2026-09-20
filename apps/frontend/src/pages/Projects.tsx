import { useEffect, useState } from "react";
import { fetchProjects } from "../api/project.api";
import type { Project } from "../types";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <h1>Projects</h1>
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <ul className="project-list">
            {projects.map((p) => (
              <li key={p.id} className="project-card">
                <Link to={`/projects/${p.id}`}>
                  <strong>{p.name}</strong>
                  <p>{p.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
