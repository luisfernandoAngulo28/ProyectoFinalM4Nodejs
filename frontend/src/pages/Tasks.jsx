import { useState, useEffect } from 'react';
import { tasksAPI, usersAPI } from '../services/api';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filters
  const [filterUserId, setFilterUserId] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    done: false,
    user_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [filterUserId, filterStatus]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksResponse, usersResponse] = await Promise.all([
        tasksAPI.getAll(),
        usersAPI.getAll(),
      ]);

      if (tasksResponse.success && usersResponse.success) {
        setTasks(tasksResponse.data);
        setUsers(usersResponse.data.filter(u => u.status === 'active'));
      }
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = async () => {
    if (!filterUserId && filterStatus === 'all') {
      loadData();
      return;
    }

    setLoading(true);
    try {
      if (filterUserId) {
        const response = await tasksAPI.getByUserId(filterUserId);
        if (response.success) {
          let filtered = response.data;
          if (filterStatus !== 'all') {
            filtered = filtered.filter(t => 
              filterStatus === 'done' ? t.done : !t.done
            );
          }
          setTasks(filtered);
        }
      } else {
        const response = await tasksAPI.getAll();
        if (response.success) {
          const filtered = response.data.filter(t =>
            filterStatus === 'all' ? true :
            filterStatus === 'done' ? t.done : !t.done
          );
          setTasks(filtered);
        }
      }
    } catch (err) {
      setError('Error al filtrar tareas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({ name: '', done: false, user_id: users[0]?.id || '' });
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setFormData({ 
      name: task.name, 
      done: task.done, 
      user_id: task.user_id 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      const response = await tasksAPI.delete(id);
      if (response.success) {
        setSuccess('Tarea eliminada exitosamente');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar tarea');
    }
  };

  const handleToggleDone = async (task) => {
    try {
      const response = await tasksAPI.update(task.id, {
        done: !task.done,
      });
      if (response.success) {
        loadData();
      }
    } catch (err) {
      setError('Error al actualizar tarea');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = modalMode === 'create'
        ? await tasksAPI.create(formData)
        : await tasksAPI.update(selectedTask.id, formData);

      if (response.success) {
        setSuccess(
          modalMode === 'create'
            ? 'Tarea creada exitosamente'
            : 'Tarea actualizada exitosamente'
        );
        setShowModal(false);
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map((e) => e.msg)
          .join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Error al guardar tarea');
      }
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const stats = getTaskStats();

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 className="dashboard-title">Tareas</h1>
          <button onClick={handleCreate} className="btn btn-primary">
            ➕ Nueva Tarea
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completadas</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              {stats.completed}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pendientes</div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>
              {stats.pending}
            </div>
          </div>
        </div>

        <div className="filters">
          <div className="form-group">
            <label className="form-label">Filtrar por Usuario</label>
            <select
              className="form-input"
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
            >
              <option value="">Todos los usuarios</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Filtrar por Estado</label>
            <select
              className="form-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="done">Completadas</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tarea</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>Creada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-light)' }}>
                      No se encontraron tareas
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleToggleDone(task)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                            {task.name}
                          </span>
                        </div>
                      </td>
                      <td>{task.username}</td>
                      <td>
                        <span
                          className={`badge ${
                            task.done ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {task.done ? '✓ Completada' : '⏳ Pendiente'}
                        </span>
                      </td>
                      <td>{new Date(task.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEdit(task)}
                            className="btn btn-primary btn-small"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="btn btn-danger btn-small"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalMode === 'create' ? 'Nueva Tarea' : 'Editar Tarea'}
              </h2>
              <button onClick={() => setShowModal(false)} className="modal-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre de la tarea</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  minLength={3}
                  maxLength={255}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Usuario asignado</label>
                <select
                  className="form-input"
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: Number(e.target.value) })
                  }
                  required
                >
                  <option value="">Seleccionar usuario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.done}
                    onChange={(e) =>
                      setFormData({ ...formData, done: e.target.checked })
                    }
                  />
                  <span>Tarea completada</span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'create' ? 'Crear' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
