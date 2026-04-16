import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

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
    <div className="flex flex-col h-[600px] bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800">
      <div className="p-4 bg-blue-600 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold">SSC AI Tutor</h3>
          <p className="text-xs text-blue-100">Always active to help you</p>
        </div>
      </div>

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
            onClick={handleSend}
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
