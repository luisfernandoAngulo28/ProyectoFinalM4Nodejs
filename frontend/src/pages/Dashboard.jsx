import { useState, useEffect } from 'react';
import { usersAPI, tasksAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersResponse, tasksResponse] = await Promise.all([
        usersAPI.getAll(),
        tasksAPI.getAll(),
      ]);

      if (usersResponse.success && tasksResponse.success) {
        const users = usersResponse.data;
        const tasks = tasksResponse.data;

        setStats({
          totalUsers: users.length,
          activeUsers: users.filter((u) => u.status === 'active').length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t) => t.done).length,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p style={{ color: 'var(--text-light)' }}>
          Bienvenido al panel de control de superhéroes
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Usuarios</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Usuarios Activos</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {stats.activeUsers}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Tareas</div>
          <div className="stat-value">{stats.totalTasks}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Tareas Completadas</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {stats.completedTasks}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Acerca de este proyecto</div>
        <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>
          Dashboard desarrollado en React para gestionar la API de superhéroes.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <strong>Características:</strong>
            <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', color: 'var(--text-light)' }}>
              <li>✅ Autenticación JWT</li>
              <li>✅ CRUD completo de usuarios</li>
              <li>✅ Gestión de tareas</li>
              <li>✅ Paginación y búsqueda</li>
              <li>✅ Filtros y ordenamiento</li>
            </ul>
          </div>
          <div>
            <strong>Tecnologías:</strong>
            <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', color: 'var(--text-light)' }}>
              <li>⚛️ React 18</li>
              <li>⚡ Vite</li>
              <li>🚀 React Router</li>
              <li>📡 Axios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
