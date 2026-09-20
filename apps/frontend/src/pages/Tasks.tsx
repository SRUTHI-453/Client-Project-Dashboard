import { useEffect, useState, FormEvent } from "react";
import { fetchTasks, updateTaskStatus, createTask } from "../api/task.api";
import { fetchProjects } from "../api/project.api";
import type { Task, Project } from "../types";
import Header from "../components/Header";

const STATUSES = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedDeveloperId, setAssignedDeveloperId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadTasks();
    fetchProjects().then(setProjects);
  }, []);

  function loadTasks() {
    fetchTasks()
      .then(setTasks)
      .finally(() => setLoading(false));
  }

  async function handleStatusChange(taskId: string, newStatus: string) {
    await updateTaskStatus(taskId, newStatus);
    loadTasks();
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setCreating(true);

    try {
      await createTask({
        title,
        projectId,
        assignedDeveloperId: assignedDeveloperId || undefined,
        priority,
        dueDate: dueDate || undefined,
        status: "TODO",
      });
      setTitle("");
      setProjectId("");
      setAssignedDeveloperId("");
      setPriority("MEDIUM");
      setDueDate("");
      setShowForm(false);
      loadTasks();
    } catch (err) {
      setFormError("Failed to create task. Check that the project ID is valid.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="notifications-header">
          <h1>Tasks</h1>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Task"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="task-form">
            {formError && <p className="error-text">{formError}</p>}

            <label>
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label>
              Project
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Assigned Developer ID (optional)
              <input
                value={assignedDeveloperId}
                onChange={(e) => setAssignedDeveloperId(e.target.value)}
                placeholder="Paste developer's user ID"
              />
            </label>

            <label>
              Priority
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Due Date
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </label>

            <button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create Task"}
            </button>
          </form>
        )}

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Overdue</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.priority}</td>
                  <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</td>
                  <td>
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{t.isOverdue ? "Overdue" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
