import { useState, useEffect } from "react";
import { StudyTask } from "../types";
import { Plus, CheckCircle2, Circle, Trash2, Calendar, Play, Pause, RotateCcw, Timer } from "lucide-react";
import { cn } from "../lib/utils";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

const TIMER_MODES = {
  WORK: { label: 'Focus', time: 25 * 60, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  BREAK: { label: 'Break', time: 5 * 60, color: 'text-green-400', bg: 'bg-green-400/10' },
};

export default function StudyPlanner() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.WORK.time);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'WORK' | 'BREAK'>('WORK');
  
  const user = auth.currentUser;

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const nextMode = mode === 'WORK' ? 'BREAK' : 'WORK';
      setMode(nextMode);
      setTimeLeft(TIMER_MODES[nextMode].time);
      // Play a subtle notification sound or alert if possible (optional)
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMER_MODES[mode].time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!user) return;

    const tasksRef = doc(db, 'users', user.uid, 'planner', 'tasks');
    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.tasks) {
          setTasks(data.tasks);
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/planner/tasks`);
    });

    return () => unsubscribe();
  }, [user]);

  const syncTasks = async (updatedTasks: StudyTask[]) => {
    if (!user) return;
    try {
      const tasksRef = doc(db, 'users', user.uid, 'planner', 'tasks');
      await setDoc(tasksRef, { 
        tasks: updatedTasks,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/planner/tasks`);
    }
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: StudyTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.trim(),
      subjectId: "general",
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
    };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    syncTasks(updatedTasks);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    syncTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    syncTasks(updatedTasks);
  };

  return (
    <div className="bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-800 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Study Planner</h2>
          <p className="text-sm text-slate-400">Organize your sessions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-2xl border border-slate-700">
            <button
              onClick={() => { setMode('WORK'); setTimeLeft(TIMER_MODES.WORK.time); setIsActive(false); }}
              className={cn("px-4 py-1.5 rounded-xl text-xs font-bold transition-all", mode === 'WORK' ? "bg-blue-600 text-white" : "text-slate-400")}
            >
              Focus
            </button>
            <button
              onClick={() => { setMode('BREAK'); setTimeLeft(TIMER_MODES.BREAK.time); setIsActive(false); }}
              className={cn("px-4 py-1.5 rounded-xl text-xs font-bold transition-all", mode === 'BREAK' ? "bg-green-600 text-white" : "text-slate-400")}
            >
              Break
            </button>
          </div>
          <div className="bg-blue-900/20 p-3 rounded-2xl">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="bg-slate-800/50 border border-slate-800 rounded-3xl p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg", TIMER_MODES[mode].bg)}>
            <Timer className={cn("w-7 h-7", TIMER_MODES[mode].color)} />
          </div>
          <div>
            <div className="text-3xl font-black text-slate-100 font-mono tracking-wider tabular-nums">
              {formatTime(timeLeft)}
            </div>
            <p className={cn("text-[10px] font-bold uppercase tracking-widest", TIMER_MODES[mode].color)}>
              {TIMER_MODES[mode].label} Mode
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={resetTimer}
            className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-all border border-slate-700"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTimer}
            className={cn(
              "w-16 h-12 flex items-center justify-center rounded-xl transition-all shadow-xl shadow-blue-900/20",
              isActive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {isActive ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a study goal..."
          className="flex-1 p-5 bg-slate-800 rounded-2xl border-2 border-slate-700 focus:outline-none focus:border-blue-500 text-lg font-medium transition-all text-slate-100 placeholder:text-slate-500"
        />
        <button
          onClick={addTask}
          className="p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm">No tasks yet. Start planning!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={cn(
                "group flex items-center justify-between p-4 rounded-2xl border transition-all",
                task.completed ? "bg-slate-800/50 border-slate-800" : "bg-slate-800 border-slate-700 hover:border-blue-500"
              )}
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id)} className="text-blue-400">
                  {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                <span className={cn("text-sm font-medium", task.completed ? "text-slate-500 line-through" : "text-slate-200")}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
