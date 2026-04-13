import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Layout, LogOut, User, FileText, BarChart2, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-4 py-3 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-primary-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
            <Layout className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">AI Resume <span className="text-primary-600 dark:text-primary-400">Pro</span></span>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-10">
          {user ? (
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold transition-colors">Dashboard</Link>
              <Link to="/upload" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold transition-colors">Analyze</Link>
            </div>
          ) : null}

          <div className="flex items-center space-x-3">
             <button 
              onClick={toggleTheme}
              className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700 overflow-hidden group"
              aria-label="Toggle Theme"
            >
              <motion.div
                initial={false}
                animate={{ y: isDarkMode ? -40 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Moon className="w-5 h-5 text-indigo-600" />
              </motion.div>
              <motion.div
                initial={false}
                style={{ position: 'absolute', top: '2.5rem', left: '0.625rem' }}
                animate={{ y: isDarkMode ? -40 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Sun className="w-5 h-5 text-yellow-500" />
              </motion.div>
            </button>

            {user ? (
              <div className="flex items-center space-x-3 ml-2 border-l border-slate-200 dark:border-slate-800 pl-4">
                <Link 
                  to="/profile" 
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-primary-500 transition-all"
                >
                  {user.profile_photo ? (
                    <img src={user.profile_photo} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-500 dark:text-slate-400 font-bold hover:text-primary-600">Login</Link>
                <Link to="/signup" className="btn-primary py-2.5 px-6 rounded-2xl">Signup</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
