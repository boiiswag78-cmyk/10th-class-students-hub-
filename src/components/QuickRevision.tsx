import { REVISION_NOTES } from "../constants";
import { Zap, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export default function QuickRevision() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quick Revision</h2>
          <p className="text-sm text-slate-500">Essential formulas and key points</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-2xl">
          <Zap className="w-6 h-6 text-blue-600 fill-blue-600" />
        </div>
      </div>

      <div className="space-y-10">
        {REVISION_NOTES.map((category, catIdx) => (
          <div key={catIdx}>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
              {category.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.notes.map((note, noteIdx) => {
                const id = `${catIdx}-${noteIdx}`;
                return (
                  <motion.div
                    key={id}
                    whileHover={{ y: -2 }}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group relative"
                  >
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">{note.title}</p>
                    <p className="text-lg font-mono text-slate-800 font-medium">{note.formula}</p>
                    <button
                      onClick={() => copyToClipboard(note.formula, id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50"
                    >
                      {copiedId === id ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
