import { useState } from "react";
import { StudyTask } from "../types";
import { Plus, CheckCircle2, Circle, Trash2, Calendar } from "lucide-react";
import { cn } from "../lib/utils";

export default function StudyPlanner() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: StudyTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.trim(),
      subjectId: "general",
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Study Planner</h2>
          <p className="text-sm text-slate-500">Organize your daily study goals</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-2xl">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a study goal..."
          className="flex-1 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:outline-none focus:border-blue-500 text-lg font-medium transition-all"
        />
        <button
          onClick={addTask}
          className="p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm">No tasks yet. Start planning!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={cn(
                "group flex items-center justify-between p-4 rounded-2xl border transition-all",
                task.completed ? "bg-slate-50 border-slate-100" : "bg-white border-slate-200 hover:border-blue-300"
              )}
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id)} className="text-blue-600">
                  {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                <span className={cn("text-sm font-medium", task.completed ? "text-slate-400 line-through" : "text-slate-700")}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"
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
