import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-left">
        <h2 className="app-title">CLIENT DASHBOARD</h2>
        <nav className="app-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/notifications">Notifications</Link>
        </nav>
      </div>
      <div className="app-header-right">
        <span className="role-badge">{user?.role}</span>
        <span className="user-name">{user?.name}</span>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </header>
  );
}
