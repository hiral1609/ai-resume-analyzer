import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/api';
import { User, Mail, Phone, Camera, Save, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profile_photo: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profile_photo: user.profile_photo || ''
      });
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic size check
      if (file.size > 2 * 1024 * 1024) {
        setMsg({ type: 'error', text: 'Image too large. Max 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const response = await auth.updateProfile(formData);
      // Persist the updated user data in context and localStorage
      login(response.data, localStorage.getItem('token'));
      setMsg({ type: 'success', text: 'Profile updated and synced successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Security & Profile</h1>
          <p className="text-xl text-slate-500 font-medium">Manage your digital identity and contact details.</p>
        </div>

        <div className="glass-card rounded-[3rem] p-10 md:p-14 shadow-2xl border-none relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[3rem] -z-10"></div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative">
                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100 flex items-center justify-center">
                  {formData.profile_photo ? (
                    <img src={formData.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-20 h-20 text-slate-300" />
                  )}
                </div>
                <label 
                  htmlFor="photo-upload"
                  className="absolute -bottom-2 -right-2 p-4 bg-primary-600 text-white rounded-2xl shadow-xl hover:bg-primary-700 transition-all cursor-pointer hover:scale-110 active:scale-95"
                >
                  <Camera className="w-6 h-6" />
                  <input 
                    id="photo-upload"
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-400 uppercase tracking-widest">Profile Picture</p>
            </div>

            <AnimatePresence>
              {msg.text && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-sm ${
                    msg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                  }`}
                >
                  {msg.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                  <span className="text-lg">{msg.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 w-5 h-5 transition-colors" />
                  <input 
                    type="text"
                    required
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 w-5 h-5 transition-colors" />
                  <input 
                    type="email"
                    required
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 w-5 h-5 transition-colors" />
                  <input 
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-slate-900"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-6"
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 shadow-xl transition-all"
              >
                {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <><Save className="w-7 h-7" /> Save Global Profile</>}
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

const Info = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

export default ProfilePage;
