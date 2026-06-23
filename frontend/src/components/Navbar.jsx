import { useAuth } from "../utils/useAuth";
import { useNavigate, Link } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-xl font-bold hover:text-blue-100">
            🌐 Social Network
          </Link>
        </div>

        {user && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="hover:text-blue-100">
                Dashboard
              </Link>
              <Link to="/discover" className="hover:text-blue-100">
                Discover
              </Link>
              <Link to="/friends" className="hover:text-blue-100">
                Friends
              </Link>
              <Link to="/requests" className="hover:text-blue-100">
                Requests
              </Link>
              <Link to="/profile" className="hover:text-blue-100">
                Profile
              </Link>
            </div>

            <div className="flex items-center space-x-3 border-l pl-6">
              <div className="text-sm">
                <p className="font-semibold">{user.name}</p>
                <p className="text-blue-200 text-xs">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
