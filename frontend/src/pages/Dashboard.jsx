import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analysis } from '../services/api';
import { FileText, Plus, History, ChevronRight, Search, Layout, Target, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await analysis.getHistory();
        setHistory(response.data || []);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">Your Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Overview of your resume analyses and job matches</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2 px-8 py-4 text-lg">
          <Plus className="w-6 h-6" /> New Analysis
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <History className="w-8 h-8 text-primary-600" />, label: "Total Analyses", val: history.length, color: "border-l-primary-500", bg: "bg-primary-50 dark:bg-primary-950/30" },
          { icon: <Target className="w-8 h-8 text-green-600" />, label: "Avg. Match Score", val: `${history.length > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.match_score, 0) / history.length) : 0}%`, color: "border-l-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
          { icon: <Layout className="w-8 h-8 text-indigo-600" />, label: "Recent Result", val: history.length > 0 ? `${history[0].match_score}%` : 'N/A', color: "border-l-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className={`glass-card p-6 rounded-3xl border-l-[6px] ${stat.color} hover:shadow-2xl transition-all`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 ${stat.bg} rounded-2xl`}>
                {stat.icon}
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 font-bold uppercase text-sm tracking-wider">{stat.label}</h3>
            </div>
            <p className="text-5xl font-black text-slate-900 dark:text-white">{stat.val}</p>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border-none">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base focus:ring-2 focus:ring-primary-500 dark:text-white outline-none w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider font-black">
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Match Score</th>
                <th className="px-8 py-5">Domain</th>
                <th className="px-8 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                   <td colSpan="4" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Loading your history...</p>
                    </div>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center">
                        <FileText className="w-10 h-10 text-slate-200 dark:text-slate-700" />
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white font-black text-2xl">No reports yet</p>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Start your first analysis to see results here.</p>
                      </div>
                      <Link to="/upload" className="btn-primary px-8 py-3">Start First Analysis</Link>
                    </div>
                  </td>
                </tr>
              ) : history.map((item, idx) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.match_score}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full rounded-full ${
                            item.match_score > 70 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 
                            item.match_score > 40 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                          }`}
                        ></motion.div>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white text-lg">{item.match_score}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700">
                      {item.domain || 'General'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <Link 
                      to={`/results/${item.id}`} 
                      className="text-primary-600 dark:text-primary-400 font-black flex items-center gap-1 group-hover:gap-2 transition-all p-2 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-xl inline-flex"
                    >
                      View Report <ChevronRight className="w-5 h-5" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
