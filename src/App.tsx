import { useState, useEffect, useRef } from "react";
import { 
  GraduationCap, 
  Book, 
  CheckCircle, 
  LayoutDashboard, 
  MessageSquare, 
  Zap, 
  Trophy,
  TrendingUp,
  ArrowRight,
  Activity,
  Clock,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import ReactMarkdown from "react-markdown";
import { SUBJECTS, SAMPLE_QUIZ, SUBJECT_NOTES } from "./constants";
import SubjectCard from "./components/SubjectCard";
import Quiz from "./components/Quiz";
import AITutor from "./components/AITutor";
import StudyPlanner from "./components/StudyPlanner";
import QuickRevision from "./components/QuickRevision";
import Auth from "./components/Auth";
import { cn } from "./lib/utils";
import { UserProgress, Subject, StudyTask } from "./types";

const RECENT_ACTIVITIES = [
  { id: 1, type: 'quiz', title: 'Completed Math Quiz', time: '2 hours ago', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 2, type: 'study', title: 'Studied Science Notes', time: '4 hours ago', icon: Book, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 3, type: 'task', title: 'Finished Telugu Assignment', time: 'Yesterday', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "tutor" | "planner" | "revision">("dashboard");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{ title: string; content: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [progress, setProgress] = useState<UserProgress[]>(
    SUBJECTS.map(s => ({ subjectId: s.id, score: 0, totalQuizzes: 0 }))
  );

  const handleQuizComplete = (score: number) => {
    if (!selectedSubject) return;
    setProgress(prev => prev.map(p => 
      p.subjectId === selectedSubject.id 
        ? { ...p, score: p.score + score, totalQuizzes: p.totalQuizzes + 1 } 
        : p
    ));
  };

  const chartData = progress.map(p => ({
    name: SUBJECTS.find(s => s.id === p.subjectId)?.name.split(' ')[0],
    score: p.score,
    color: '#3b82f6'
  }));

  if (!isAuthenticated) {
    return <Auth onLogin={(phone) => {
      setUserPhone(phone);
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* Simple Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl px-8 py-4 flex items-center gap-12 z-50">
        <button 
          onClick={() => { setActiveTab("dashboard"); setSelectedSubject(null); setShowQuiz(false); setSelectedNote(null); }}
          className={cn("flex flex-col items-center gap-2 transition-all hover:scale-110", activeTab === "dashboard" ? "text-blue-400" : "text-slate-500")}
        >
          <LayoutDashboard className="w-8 h-8" />
        </button>
        <button 
          onClick={() => { setActiveTab("planner"); setSelectedNote(null); }}
          className={cn("flex flex-col items-center gap-2 transition-all hover:scale-110", activeTab === "planner" ? "text-blue-400" : "text-slate-500")}
        >
          <CheckCircle className="w-8 h-8" />
        </button>
        <button 
          onClick={() => { setActiveTab("tutor"); setSelectedNote(null); }}
          className={cn("flex flex-col items-center gap-2 transition-all hover:scale-110", activeTab === "tutor" ? "text-blue-400" : "text-slate-500")}
        >
          <MessageSquare className="w-8 h-8" />
        </button>
        <button 
          onClick={() => { setActiveTab("revision"); setSelectedNote(null); }}
          className={cn("flex flex-col items-center gap-2 transition-all hover:scale-110", activeTab === "revision" ? "text-blue-400" : "text-slate-500")}
        >
          <Zap className="w-8 h-8" />
        </button>
      </nav>

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setActiveTab("dashboard"); setSelectedSubject(null); setShowQuiz(false); setSelectedNote(null); }}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-100 uppercase leading-none">10th Hub</h1>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-1">SSC AP Prep</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-200">{progress.reduce((acc, p) => acc + p.score, 0)} Points</span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700 shadow-lg group cursor-pointer hover:border-blue-500 transition-colors">
              <img 
                src={`https://picsum.photos/seed/${userPhone}/100/100`} 
                alt="Profile" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {!selectedSubject ? (
                <>
                  {/* Hero Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 flex flex-col justify-between h-[300px]">
                      <div>
                        <h2 className="text-2xl font-bold mb-2 text-slate-100">Your Progress</h2>
                        <p className="text-slate-400 text-sm">Keep going! You're doing great.</p>
                      </div>
                      <div className="flex-1 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis hide />
                            <Tooltip 
                              cursor={{ fill: '#0f172a' }}
                              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                            />
                            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-900/20 text-white flex flex-col justify-between h-[300px]">
                      <div>
                        <TrendingUp className="w-10 h-10 mb-4 opacity-80" />
                        <h2 className="text-2xl font-bold mb-2">Daily Streak</h2>
                        <p className="text-blue-100 text-sm">You've studied for 5 days in a row!</p>
                      </div>
                      <div className="text-5xl font-black">5 DAYS</div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tighter">Recent Activity</h3>
                        <p className="text-sm text-slate-400 font-medium">Your latest study milestones</p>
                      </div>
                      <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                        <Activity className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {RECENT_ACTIVITIES.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-5 bg-slate-800/40 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all group">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", activity.bg)}>
                            <activity.icon className={cn("w-7 h-7", activity.color)} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors leading-tight">{activity.title}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Revision Shortcut */}
                  <div 
                    onClick={() => { setActiveTab("revision"); setSelectedNote(null); }}
                    className="bg-slate-900 border-2 border-slate-800 p-8 rounded-3xl flex items-center justify-between cursor-pointer hover:border-blue-600 transition-all group shadow-sm"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20">
                        <Zap className="w-8 h-8 text-white fill-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-100">⚡ Quick Revision</h3>
                        <p className="text-slate-400 font-medium">Review essential formulas and key concepts instantly.</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <TrendingUp className="w-6 h-6 rotate-90" />
                    </div>
                  </div>

                  {/* Subjects Grid */}
                  <div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-100">
                      <span className="w-2 h-8 bg-blue-600 rounded-full" />
                      Explore Subjects
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {SUBJECTS.map(subject => (
                        <SubjectCard 
                          key={subject.id} 
                          subject={subject} 
                          onClick={() => { setSelectedSubject(subject); setSelectedNote(null); }} 
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => { setSelectedSubject(null); setShowQuiz(false); setSelectedNote(null); }}
                      className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <LayoutDashboard className="w-6 h-6 text-slate-400" />
                    </button>
                    <h2 className="text-3xl font-black tracking-tight text-slate-100">{selectedSubject.name}</h2>
                  </div>

                  {!showQuiz ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-8">
                        {selectedNote ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800"
                          >
                            <button 
                              onClick={() => setSelectedNote(null)}
                              className="mb-6 text-sm font-bold text-blue-400 flex items-center gap-2 hover:underline"
                            >
                              ← Back to Topics
                            </button>
                            <div className="markdown-body dark">
                              <ReactMarkdown
                                components={{
                                  img: ({ node, ...props }) => (
                                    <img 
                                      {...props} 
                                      referrerPolicy="no-referrer" 
                                      className="rounded-2xl shadow-lg border border-slate-800 my-6"
                                    />
                                  )
                                }}
                              >
                                {selectedNote.content}
                              </ReactMarkdown>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-100">
                              <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                              Syllabus Topics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedSubject.topics?.map((topic, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-slate-800 rounded-2xl border border-slate-700">
                                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-xs font-bold text-blue-400 shadow-sm">
                                    {idx + 1}
                                  </div>
                                  <span className="text-sm font-medium text-slate-300">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800">
                          <h3 className="text-xl font-bold mb-4 text-slate-100">Quick Practice</h3>
                          <p className="text-slate-400 mb-8">Test your knowledge with a quick 10-minute MCQ session based on the latest board patterns.</p>
                          <button 
                            onClick={() => setShowQuiz(true)}
                            className="w-full py-6 bg-blue-600 text-white rounded-2xl text-xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 uppercase tracking-tight"
                          >
                            Start Practice Quiz
                          </button>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {SUBJECT_NOTES[selectedSubject.id] && (
                          <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-100">
                              <Book className="w-5 h-5 text-blue-400" />
                              Subject Notes
                            </h3>
                            <div className="space-y-3">
                              {SUBJECT_NOTES[selectedSubject.id].map((note, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedNote(note)}
                                  className="w-full text-left p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-600 hover:bg-blue-900/20 transition-all group"
                                >
                                  <span className="text-sm font-bold text-slate-300 group-hover:text-blue-400">{note.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 h-fit">
                          <h3 className="text-xl font-bold mb-4 text-slate-100">Study Resources</h3>
                          <ul className="space-y-4">
                            {["Chapter Notes", "Formula Sheets", "Previous Year Papers", "Question Bank"].map(item => (
                              <li key={item} className="flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-600 transition-all cursor-pointer group">
                                <span className="font-medium text-slate-300">{item}</span>
                                <TrendingUp className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Quiz 
                      questions={SAMPLE_QUIZ[selectedSubject.id] || []} 
                      onComplete={handleQuizComplete}
                      onClose={() => setShowQuiz(false)}
                    />
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "planner" && (
            <motion.div
              key="planner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto h-[700px]"
            >
              <StudyPlanner />
            </motion.div>
          )}

          {activeTab === "tutor" && (
            <motion.div
              key="tutor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <AITutor />
            </motion.div>
          )}

          {activeTab === "revision" && (
            <motion.div
              key="revision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto h-[700px]"
            >
              <QuickRevision />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
