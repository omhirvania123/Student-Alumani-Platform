import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Settings, Bell, LogOut, User, ChevronDown, Shield } from 'lucide-react';

const Navbar = ({ handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [hasNewNotifications] = useState(true);
  const { user } = useUser();

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path) => {
    return location.pathname === `/dashboard${path}` ? 
      'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border-b-2 border-blue-600' : 
      'text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5';
  };

  const onLogout = () => {
    handleLogout();
    navigate('/login');
    setIsProfileDropdown(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg fixed w-full top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow"
              >
                <span className="text-xl font-bold text-white">A</span>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AlumniConnect
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${isActive('/')}`}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </motion.div>
            {user?.role === 'admin' && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  to="/admin"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    location.pathname.startsWith('/admin') ? 
                    'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border-b-2 border-blue-600' : 
                    'text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5'
                  }`}
                >
                  <Shield size={18} />
                  <span>Admin</span>
                </Link>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/dashboard/settings"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${isActive('/settings')}`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Side - Profile & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full relative transition-colors duration-200"
            >
              <Bell size={20} />
              {hasNewNotifications && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
                />
              )}
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative">
              <motion.button 
                onClick={() => setIsProfileDropdown(!isProfileDropdown)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center ring-2 ring-white">
                  <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {getInitials(user?.name)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'Loading...'}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-56 bg-white backdrop-blur-lg rounded-xl shadow-xl py-1 z-50 border border-gray-200/50"
                  >
                    <div className="px-4 py-3 border-b border-gray-200/50">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link 
                        to="/dashboard/profile" 
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                        onClick={() => setIsProfileDropdown(false)}
                      >
                        <User size={16} />
                        <span>View Profile</span>
                      </Link>
                      <Link 
                        to="/dashboard/settings" 
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                        onClick={() => setIsProfileDropdown(false)}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="py-1 border-t border-gray-200/50">
                      <button 
                        onClick={onLogout}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;