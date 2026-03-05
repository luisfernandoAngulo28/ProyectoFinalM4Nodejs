import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination and filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('id');
  const [orderDir, setOrderDir] = useState('ASC');
  const [statusFilter, setStatusFilter] = useState(''); // Filtro por status

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    status: 'active',
  });

  useEffect(() => {
    loadUsers();
  }, [page, limit, search, orderBy, orderDir, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit,
        search,
        orderBy,
        orderDir,
      };
      
      // Solo agregar status si hay un filtro seleccionado
      if (statusFilter) {
        params.status = statusFilter;
      }
      
      const response = await usersAPI.getPaginated(params);

      if (response.success) {
        setUsers(response.data);
        setTotalPages(response.pages);
        setTotal(response.total);
      }
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({ username: '', password: '', status: 'active' });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({ username: user.username, password: '', status: user.status });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const response = await usersAPI.delete(id);
      if (response.success) {
        setSuccess('Usuario eliminado exitosamente');
        loadUsers();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = modalMode === 'create'
        ? await usersAPI.create(formData)
        : await usersAPI.update(selectedUser.id, formData);

      if (response.success) {
        setSuccess(
          modalMode === 'create'
            ? 'Usuario creado exitosamente'
            : 'Usuario actualizado exitosamente'
        );
        setShowModal(false);
        loadUsers();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map((e) => e.msg)
          .join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Error al guardar usuario');
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 className="dashboard-title">Usuarios</h1>
          <button onClick={handleCreate} className="btn btn-primary">
            ➕ Nuevo Usuario
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="filters">
          <div className="form-group">
            <label className="form-label">Buscar</label>
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por username..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estado</label>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Ordenar por</label>
            <select
              className="form-input"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
            >
              <option value="id">ID</option>
              <option value="username">Username</option>
              <option value="status">Estado</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dirección</label>
            <select
              className="form-input"
              value={orderDir}
              onChange={(e) => setOrderDir(e.target.value)}
            >
              <option value="ASC">Ascendente</option>
              <option value="DESC">Descendente</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Por página</label>
            <select
              className="form-input"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Estado</th>
                    <th>Creado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-light)' }}>
                        No se encontraron usuarios
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.status === 'active'
                                ? 'badge-success'
                                : 'badge-warning'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEdit(user)}
                              className="btn btn-primary btn-small"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
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

          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn btn-outline btn-small"
            >
              ← Anterior
            </button>
            <span className="pagination-info">
              Página {page} de {totalPages} ({total} usuarios)
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="btn btn-outline btn-small"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalMode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
              </h2>
              <button onClick={() => setShowModal(false)} className="modal-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Contraseña {modalMode === 'edit' && '(dejar vacío para no cambiar)'}
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={modalMode === 'create'}
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
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

export default Users;
