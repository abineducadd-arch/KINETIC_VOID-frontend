import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiHome, FiBook, FiBarChart2 } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-white/10 neon-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-black text-primary italic tracking-tighter">
            KINETIC_VOID
          </Link>
          
          {/* Reduced gap from space-x-8 to space-x-4 */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className="text-on-surface-variant hover:text-secondary transition-colors">
              Home
            </Link>
            <Link to="/games" className="text-on-surface-variant hover:text-secondary transition-colors">
              Games
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-on-surface-variant hover:text-secondary transition-colors">
                Dashboard
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-secondary">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                >
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-secondary border border-secondary/30 hover:bg-secondary/10 rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 primary-gradient text-white rounded-lg hover:opacity-90 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;