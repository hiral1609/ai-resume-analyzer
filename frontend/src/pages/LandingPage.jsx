import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Shield, Target, Zap, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20">
        {/* Modern AI Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/ai-bg.png" 
            alt="AI Background" 
            className="w-full h-full object-cover dark:opacity-40 transition-opacity duration-500"
          />
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-white dark:to-slate-950"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-white/10 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-700 text-white text-sm font-bold tracking-widest uppercase mb-8">
                <Sparkles className="w-4 h-4 text-primary-400" /> Powered by GPT-4 & Gemini
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tight">
                Optimize Your <br/> Career with <span className="text-primary-400 italic">AI.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-slate-200 dark:text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
                The most advanced Resume Analyzer. Get domain-specific insights, 
                bridge your skill gaps, and land your dream job faster.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/signup" className="btn-primary flex items-center gap-3 text-xl px-10 py-5 shadow-2xl">
                  Get Started Free <ArrowRight className="w-6 h-6" />
                </Link>
                <Link to="/login" className="px-10 py-5 bg-white/10 dark:bg-slate-800/40 hover:bg-white/20 dark:hover:bg-slate-700/50 backdrop-blur-md border border-white/30 dark:border-slate-600 text-white rounded-2xl font-black text-xl transition-all">
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-24 bg-white dark:bg-slate-950 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Rocket className="w-8 h-8 text-primary-600 dark:text-primary-400" />, title: "ATS Check", desc: "Beat the automated filters with ease." },
              { icon: <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />, title: "Skill Gaps", desc: "Instantly see exactly what skills you're missing." },
              { icon: <Zap className="w-8 h-8 text-primary-500 dark:text-primary-400" />, title: "AI Suggestions", desc: "Get real-time feedback on how to improve." },
              { icon: <Sparkles className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />, title: "Project Ideas", desc: "Custom projects to boost your portfolio." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all shadow-sm hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-slate-900 border-t border-slate-800 relative z-10">
        <div className="absolute inset-0 opacity-10">
           <img src="/images/ai-bg.png" alt="Overlay" className="w-full h-full object-cover blur-sm" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-8">Ready to land your dream role?</h2>
            <p className="text-2xl text-slate-400 mb-12 font-medium">Join 50,000+ applicants who have optimized their careers using our platform.</p>
            <Link to="/signup" className="btn-primary inline-flex px-12 py-5 text-2xl font-black shadow-[0_20px_50px_rgba(0,102,255,0.4)]">Join AI Resume Pro Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
