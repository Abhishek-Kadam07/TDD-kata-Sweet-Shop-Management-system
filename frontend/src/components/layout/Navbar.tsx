import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-pink-600">🍭 Sweet Shop</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;