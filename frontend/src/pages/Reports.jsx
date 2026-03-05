import { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';

function Reports() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  
  // Estados para diferentes reportes
  const [generalStats, setGeneralStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [usersComparison, setUsersComparison] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [general, top, progress, comparison, inactive] = await Promise.all([
        reportsAPI.getGeneralStats(),
        reportsAPI.getTopUsers(10),
        reportsAPI.getUserProgress(),
        reportsAPI.getUsersComparison(),
        reportsAPI.getInactiveUsers(),
      ]);

      setGeneralStats(general.data);
      setTopUsers(top.data);
      setUserProgress(progress.data);
      setUsersComparison(comparison.data);
      setInactiveUsers(inactive.data);
    } catch (error) {
      console.error('Error loading reports:', error);
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
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Reportes y Estadísticas</h1>
        <p style={{ color: '#64748b' }}>
          Análisis detallado de usuarios y tareas
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          📈 General
        </button>
        <button
          className={`tab ${activeTab === 'ranking' ? 'active' : ''}`}
          onClick={() => setActiveTab('ranking')}
        >
          🏆 Ranking
        </button>
        <button
          className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          📊 Progreso
        </button>
        <button
          className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          ⚖️ Comparativa
        </button>
        <button
          className={`tab ${activeTab === 'inactive' ? 'active' : ''}`}
          onClick={() => setActiveTab('inactive')}
        >
          😴 Inactivos
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* GENERAL TAB */}
        {activeTab === 'general' && generalStats && (
          <div>
            <h2 className="section-title">Resumen General del Sistema</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Usuarios</div>
                <div className="stat-value">{generalStats.totalUsers}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Total Tareas</div>
                <div className="stat-value">{generalStats.totalTasks}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Promedio Tareas/Usuario</div>
                <div className="stat-value">{generalStats.avgTasksPerUser}</div>
              </div>
            </div>

            <div className="report-grid">
              {/* Usuarios por Estado */}
              <div className="card">
                <h3 className="card-title">👥 Usuarios por Estado</h3>
                <div className="chart-container">
                  {generalStats.usersByStatus.map((item) => {
                    const percentage = (item.count / generalStats.totalUsers) * 100;
                    return (
                      <div key={item.status} className="progress-item">
                        <div className="progress-label">
                          <span className={`badge badge-${item.status === 'active' ? 'success' : 'warning'}`}>
                            {item.status}
                          </span>
                          <span className="progress-value">{item.count} usuarios</span>
                        </div>
                        <div className="progress-bar-container">
                          <div
                            className={`progress-bar ${item.status === 'active' ? 'success' : 'warning'}`}
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tareas por Estado */}
              <div className="card">
                <h3 className="card-title">✅ Tareas por Estado</h3>
                <div className="chart-container">
                  {generalStats.tasksByStatus.map((item) => {
                    const percentage = (item.count / generalStats.totalTasks) * 100;
                    const status = item.done ? 'Completadas' : 'Pendientes';
                    return (
                      <div key={status} className="progress-item">
                        <div className="progress-label">
                          <span className={`badge badge-${item.done ? 'success' : 'info'}`}>
                            {status}
                          </span>
                          <span className="progress-value">{item.count} tareas</span>
                        </div>
                        <div className="progress-bar-container">
                          <div
                            className={`progress-bar ${item.done ? 'success' : 'info'}`}
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RANKING TAB */}
        {activeTab === 'ranking' && (
          <div>
            <h2 className="section-title">🏆 Top Usuarios con Más Tareas</h2>
            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>🥇 Ranking</th>
                      <th>Usuario</th>
                      <th>Estado</th>
                      <th>Total Tareas</th>
                      <th>✅ Completadas</th>
                      <th>⏳ Pendientes</th>
                      <th>% Completado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>
                          <span className="ranking-badge">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </span>
                        </td>
                        <td><strong>{user.username}</strong></td>
                        <td>
                          <span className={`badge badge-${user.status === 'active' ? 'success' : 'warning'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.total_tasks}</td>
                        <td>{user.completed_tasks}</td>
                        <td>{user.pending_tasks}</td>
                        <td>
                          <div className="progress-inline">
                            <div className="progress-bar-mini success" style={{ width: `${user.completion_percentage}%` }}>
                              {user.completion_percentage}%
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS TAB */}
        {activeTab === 'progress' && (
          <div>
            <h2 className="section-title">📊 Progreso de Todos los Usuarios</h2>
            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Estado</th>
                      <th>Total Tareas</th>
                      <th>✅ Completadas</th>
                      <th>⏳ Pendientes</th>
                      <th>Progreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProgress.map((user) => (
                      <tr key={user.id}>
                        <td><strong>{user.username}</strong></td>
                        <td>
                          <span className={`badge badge-${user.status === 'active' ? 'success' : 'warning'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.total_tasks}</td>
                        <td>{user.completed_tasks}</td>
                        <td>{user.pending_tasks}</td>
                        <td>
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar success"
                              style={{ width: `${user.completion_percentage}%` }}
                            >
                              {user.completion_percentage}%
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COMPARISON TAB */}
        {activeTab === 'comparison' && (
          <div>
            <h2 className="section-title">⚖️ Comparativa de Usuarios Activos</h2>
            <div className="card">
              <div className="comparison-grid">
                {usersComparison.map((user) => (
                  <div key={user.username} className="comparison-card">
                    <div className="comparison-header">
                      <h4>{user.username}</h4>
                      <span className={`badge badge-${user.status === 'active' ? 'success' : 'warning'}`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="comparison-stats">
                      <div className="comparison-stat">
                        <span className="stat-label">Total</span>
                        <span className="stat-number">{user.total_tasks}</span>
                      </div>
                      <div className="comparison-stat">
                        <span className="stat-label">✅</span>
                        <span className="stat-number">{user.completed}</span>
                      </div>
                      <div className="comparison-stat">
                        <span className="stat-label">⏳</span>
                        <span className="stat-number">{user.pending}</span>
                      </div>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar success"
                        style={{ width: `${user.completion_rate}%` }}
                      >
                        {user.completion_rate}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INACTIVE TAB */}
        {activeTab === 'inactive' && (
          <div>
            <h2 className="section-title">😴 Usuarios Sin Tareas</h2>
            <div className="card">
              {inactiveUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  🎉 ¡Excelente! Todos los usuarios tienen tareas asignadas.
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Estado</th>
                        <th>Fecha de Registro</th>
                        <th>Total Tareas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inactiveUsers.map((user) => (
                        <tr key={user.id}>
                          <td><strong>{user.username}</strong></td>
                          <td>
                            <span className={`badge badge-${user.status === 'active' ? 'success' : 'warning'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className="badge badge-danger">{user.total_tasks}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botón de actualizar */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={loadReports} className="btn btn-primary">
          🔄 Actualizar Reportes
        </button>
      </div>
    </div>
  );
}

export default Reports;
