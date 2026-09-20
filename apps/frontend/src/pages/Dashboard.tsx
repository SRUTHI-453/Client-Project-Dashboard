import { useEffect, useState } from "react";
import { fetchProjects } from "../api/project.api";
import { fetchTasks } from "../api/task.api";
import { fetchUnreadCount } from "../api/notification.api";
import type { Project, Task } from "../types";
import Header from "../components/Header";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projectsData, tasksData, unread] = await Promise.all([
          fetchProjects(),
          fetchTasks(),
          fetchUnreadCount(),
        ]);
        setProjects(projectsData);
        setTasks(tasksData);
        setUnreadCount(unread.unreadCount);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="page-loading">Loading dashboard...</p>;

  const overdueCount = tasks.filter((t) => t.isOverdue).length;
  const tasksByStatus = tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Projects</h3>
            <p>{projects.length}</p>
          </div>
          <div className="stat-card">
            <h3>Tasks</h3>
            <p>{tasks.length}</p>
          </div>
          <div className="stat-card">
            <h3>Overdue</h3>
            <p>{overdueCount}</p>
          </div>
          <div className="stat-card">
            <h3>Unread Notifications</h3>
            <p>{unreadCount}</p>
          </div>
        </div>

        <div className="status-breakdown">
          <h2>Tasks by Status</h2>
          <ul>
            {Object.entries(tasksByStatus).map(([status, count]) => (
              <li key={status}>
                {status}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
