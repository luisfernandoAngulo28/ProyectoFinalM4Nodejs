import { Link } from 'react-router-dom';

function Navbar({ onLogout, user }) {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            🦸 Superhero Dashboard
          </div>
          <div className="navbar-actions">
            <Link to="/" className="btn btn-outline btn-small">
              Dashboard
            </Link>
            <Link to="/users" className="btn btn-outline btn-small">
              Usuarios
            </Link>
            <Link to="/tasks" className="btn btn-outline btn-small">
              Tareas
            </Link>
            <Link to="/reports" className="btn btn-outline btn-small">
              📊 Reportes
            </Link>
            <button onClick={onLogout} className="btn btn-danger btn-small">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
