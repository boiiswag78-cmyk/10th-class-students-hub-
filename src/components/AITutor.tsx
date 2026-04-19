import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, Search, X, BookOpen, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import { SUBJECTS, SUBJECT_NOTES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your SSC Study Assistant. How can I help you with your 10th-grade preparation today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ subject: string; note: { title: string; content: string } }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results: { subject: string; note: { title: string; content: string } }[] = [];
      const query = searchQuery.toLowerCase();

      Object.entries(SUBJECT_NOTES).forEach(([subjectId, notes]) => {
        const subjectName = SUBJECTS.find(s => s.id === subjectId)?.name || subjectId;
        notes.forEach(note => {
          if (note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)) {
            results.push({ subject: subjectName, note });
          }
        });
      });
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const userMessage = customMessage || input.trim();
    if (!userMessage || isLoading) return;

    if (!customMessage) setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setIsSearching(false);
    setSearchQuery("");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are an expert tutor for Andhra Pradesh SSC (State Board) 10th grade students. 
            Help the student with their query: "${userMessage}". 
            Keep your explanation simple, clear, and relevant to the AP SSC curriculum. 
            Use examples where possible.` }]
          }
        ],
        config: {
          systemInstruction: "You are a helpful and encouraging Andhra Pradesh SSC 10th grade tutor. You specialize in Mathematics, Physical Science, Biological Science, Social Studies, Telugu, Hindi, and English for the AP State Board curriculum."
        }
      });

      const assistantMessage = response.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: assistantMessage }]);
    } catch (error) {
      console.error("AI Tutor Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! Something went wrong. Please check your connection and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800">
      <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">SSC AI Tutor</h3>
            <p className="text-xs text-blue-100">Always active to help you</p>
          </div>
        </div>
        <button 
          onClick={() => setIsSearching(!isSearching)}
          className={cn(
            "p-2 rounded-xl transition-all",
            isSearching ? "bg-white text-blue-600" : "bg-white/10 text-white hover:bg-white/20"
          )}
        >
          {isSearching ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>
      </div>

      {isSearching && (
        <div className="p-4 bg-slate-800 border-b border-slate-700 animate-in slide-in-from-top duration-300">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              autoFocus
              placeholder="Search syllabus topics (e.g. 'Ohm', 'Democracy')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-100"
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Relevant Notes Found</p>
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(`Tell me more about ${result.note.title} from ${result.subject}`)}
                  className="w-full flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-700 border border-slate-700/50 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-200">{result.note.title}</p>
                      <p className="text-[10px] text-slate-500">{result.subject}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                </button>
              ))}
            </div>
          )}
          
          {searchQuery.trim().length > 1 && searchResults.length === 0 && (
            <p className="mt-4 text-center text-xs text-slate-500 py-2">No direct notes found. Try asking the AI Tutor!</p>
          )}
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === "user" ? "bg-blue-900/40 text-blue-400" : "bg-slate-800 border border-slate-700 text-slate-400"
            )}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-slate-800 text-slate-200 shadow-sm border border-slate-700 rounded-tl-none"
            )}>
              <div className="markdown-body dark">
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      <img 
                        {...props} 
                        referrerPolicy="no-referrer" 
                        className="rounded-xl shadow-md border border-slate-700 my-4"
                      />
                    )
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Bot className="w-4 h-4 text-slate-500" />
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-700">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question (e.g., 'Explain Pythagoras theorem')"
            className="flex-1 p-5 bg-slate-800 rounded-2xl border-2 border-slate-700 focus:outline-none focus:border-blue-500 text-lg font-medium transition-all text-slate-100 placeholder:text-slate-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
