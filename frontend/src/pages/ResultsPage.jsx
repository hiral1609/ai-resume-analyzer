import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analysis } from '../services/api';
import { 
  Download, FileText, CheckCircle2, AlertCircle, TrendingUp, 
  Lightbulb, ChevronLeft, Loader2, Sparkles, Briefcase, Layout, ArrowRight, Layers, Code
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PageTransition from '../components/PageTransition';

const ResultsPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await analysis.getReport(id);
        setReport(response.data);
      } catch (err) {
        console.error('Failed to fetch report', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const downloadPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { 
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#f8fafc' // Force light background for PDF
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`AI_Report_${id}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 font-bold mt-6 text-xl">Retrieving report...</p>
      </div>
    );
  }

  if (!report) return <div className="p-20 text-center font-bold dark:text-white">Report not found.</div>;

  const parseJson = (val) => {
    if (!val) return [];
    return typeof val === 'string' ? JSON.parse(val) : val;
  };

  const missingSkills = parseJson(report.missing_skills);
  const suggestions = parseJson(report.suggestions);
  const strengths = parseJson(report.strengths);
  const atsCheck = parseJson(report.ats_check);
  const projects = parseJson(report.suggested_projects);
  const sectionFeedback = parseJson(report.section_feedback);

  const scoreData = [{ name: 'Match', value: report.match_score }, { name: 'Gap', value: 100 - report.match_score }];
  const COLORS = ['#0ea5e9', '#cbd5e1'];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold dark:text-slate-400 transition-colors">
            <ChevronLeft className="w-6 h-6" /> History
          </Link>
          <div className="flex gap-4">
             <div className="hidden md:flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-950/30 rounded-xl">
               <span className="text-primary-700 dark:text-primary-400 font-bold text-sm uppercase">Domain: {report.domain}</span>
             </div>
             <button onClick={downloadPDF} className="btn-secondary flex items-center gap-2 font-black dark:bg-slate-800 dark:border-slate-700">
              <Download className="w-5 h-5" /> PDF
            </button>
          </div>
        </div>

        <div ref={reportRef} className="space-y-10 pb-20 dark:bg-slate-950 p-6 rounded-[2.5rem]">
          {/* Match Score Hero */}
          <div className="glass-card rounded-[3rem] p-10 lg:p-14 border-t-[12px] border-t-primary-600 flex flex-col lg:flex-row items-center gap-12 group">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <span className="px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm">Verified Report</span>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1]">Analysis <br/><span className="gradient-text">Complete.</span></h1>
            </div>
            
            <div className="w-64 h-64 relative bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] p-4 group-hover:scale-105 transition-transform">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={scoreData} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={8} dataKey="value" startAngle={90} endAngle={450} stroke="none">
                    {scoreData.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#0ea5e9' : '#e2e8f0'} cornerRadius={15} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-slate-900 dark:text-white">{report.match_score}%</span>
                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Score</span>
              </div>
            </div>
          </div>

          {/* Section Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(sectionFeedback).map(([section, feedback], i) => (
              <motion.div 
                key={section}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-3xl border-none hover:shadow-2xl transition-all"
              >
                <h3 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span> {section}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 font-bold text-sm leading-relaxed">{feedback}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="glass-card rounded-[2rem] p-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-500" /> Key Strengths
              </h2>
              <ul className="space-y-4">
                {strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 font-bold text-lg">{str}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="glass-card rounded-[2rem] p-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" /> Missing Skills
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {missingSkills.map((skill, i) => (
                  <span key={i} className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-sm">{skill}</span>
                ))}
              </div>
            </section>
          </div>

          {/* Recommended Projects */}
          <section className="glass-card rounded-[3rem] p-10 lg:p-14 shadow-3xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                <Code className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Growth Roadmap</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projects.map((proj, i) => (
                <div key={i} className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-primary-500 transition-all group">
                   <div className="mb-4">
                    <span className="text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">{proj.stack}</span>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 transition-colors">{proj.title}</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-bold text-lg leading-relaxed">{proj.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Improvement Summary */}
          <section className="bg-slate-900 dark:bg-slate-800/50 rounded-[3rem] p-12 text-white">
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
              <Lightbulb className="w-8 h-8 text-yellow-400" /> Strategic Protocol
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {suggestions.map((sug, i) => (
                <div key={i} className="flex gap-6 items-start p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-colors">
                   <span className="text-3xl font-black text-white/20">0{i+1}</span>
                   <p className="text-lg font-bold text-slate-100 leading-relaxed">{sug}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResultsPage;
