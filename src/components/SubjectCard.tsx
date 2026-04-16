import { Subject } from "../types";
import * as Icons from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
}

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const IconComponent = (Icons as any)[subject.icon];

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer bg-slate-900 rounded-3xl p-8 shadow-sm border-2 border-slate-800 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-900/20 transition-all group"
    >
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:bg-blue-600", subject.color, "bg-opacity-10")}>
        {IconComponent && <IconComponent className={cn("w-8 h-8 transition-colors group-hover:text-white", subject.color.replace('bg-', 'text-'))} />}
      </div>
      <h3 className="text-xl font-black text-slate-100 mb-2 uppercase tracking-tight">{subject.name}</h3>
      <p className="text-sm font-medium text-slate-400 line-clamp-2 leading-relaxed">{subject.description}</p>
    </motion.div>
  );
}
