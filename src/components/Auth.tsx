import { GraduationCap, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

export default function Auth() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-900/40"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">10th Hub</h1>
          <p className="text-slate-400 font-medium">Your ultimate AP SSC study companion</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Hi, Welcome Back!</h2>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Your study progress and AI Tutor are waiting for you. Sign in to continue your journey.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-lg uppercase tracking-tight hover:bg-slate-100 active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-4 group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
            Sign in with Google
          </button>
          
          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Student Portal</span>
            </div>
          </div>
        </motion.div>

        <p className="text-center mt-8 text-slate-600 text-xs">
          By continuing, you agree to our <span className="text-slate-400 underline cursor-pointer">Terms of Service</span> and <span className="text-slate-400 underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
