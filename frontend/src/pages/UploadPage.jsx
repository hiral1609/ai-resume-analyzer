import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { resumes, analysis } from '../services/api';
import { Upload, FileText, X, Check, Loader2, Info, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const domains = [
  'Web Development', 'Data Science', 'AI/ML', 'Mobile App Development', 
  'DevOps', 'Cybersecurity', 'Product Management', 'UI/UX Design', 
  'Quality Assurance', 'Cloud Architecture'
];

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB.');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription || !domain) {
      setError('Please provide resume, job description, and select a domain.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const uploadRes = await resumes.upload(formData);
      const resumeId = uploadRes.data.resume.id;

      setUploading(false);
      setAnalyzing(true);

      const analysisRes = await analysis.run(resumeId, jobDescription, domain);
      setTimeout(() => {
        navigate(`/results/${analysisRes.data.id}`);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">AI Analysis Lab</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Get personalized, domain-specific insights for your dream job.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {(uploading || analyzing) ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass-card rounded-[2.5rem] p-16 flex flex-col items-center justify-center space-y-8 min-h-[500px]"
            >
              <div className="w-24 h-24 border-8 border-primary-100 dark:border-primary-900/30 border-t-primary-600 rounded-full animate-spin"></div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                {uploading ? 'Uploading Resume...' : 'AI Analyzing Profile...'}
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-bold">Matching semantic parameters against domain standards.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3 border border-red-100 dark:border-red-900/50 font-bold">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Domain Selection */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center font-black text-lg">1</span>
                  <label className="text-2xl font-black text-slate-900 dark:text-white">Job Domain</label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {domains.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDomain(d)}
                      className={`px-4 py-3 rounded-2xl text-sm font-black transition-all border-2 ${
                        domain === d 
                          ? 'bg-primary-600 border-primary-600 text-white shadow-xl scale-105' 
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center font-black text-lg">2</span>
                    <label className="text-2xl font-black text-slate-900 dark:text-white">Upload Resume</label>
                  </div>
                  <div 
                    {...getRootProps()} 
                    className={`border-4 border-dashed rounded-[3rem] p-10 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[350px] shadow-sm ${
                      isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-300'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {file ? (
                      <div className="text-center">
                        <Check className="w-16 h-16 text-green-500 mx-auto mb-6" />
                        <p className="text-slate-900 dark:text-white font-black text-xl mb-4">{file.name}</p>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="px-6 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl font-black text-sm">Remove File</button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <Upload className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="text-slate-900 dark:text-white font-black text-xl mb-2">Drop resume here</p>
                        <p className="text-slate-500 dark:text-slate-400 font-bold">PDF or DOCX (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center font-black text-lg">3</span>
                    <label className="text-2xl font-black text-slate-900 dark:text-white">Job Description</label>
                  </div>
                  <textarea
                    className="w-full h-full min-h-[350px] p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[3rem] focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 resize-none text-lg font-bold dark:text-white transition-all shadow-sm"
                    placeholder="Paste the target job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary py-6 text-2xl font-black flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(0,102,255,0.3)] transition-all"
              >
                Launch Intelligence Analysis <ArrowRight className="w-8 h-8" />
              </motion.button>
            </form>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default UploadPage;
