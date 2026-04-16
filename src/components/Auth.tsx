import { useState } from "react";
import { GraduationCap, Phone, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface AuthProps {
  onLogin: (phone: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [step, setStep] = useState<"phone" | "password" | "success">("phone");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setStep("password");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setStep("success");
    setTimeout(() => {
      onLogin(phone);
    }, 1500);
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

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePhoneSubmit}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Welcome Back!</h2>
                  <p className="text-sm text-slate-500 mb-6">Enter your phone number to continue</p>
                  
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Phone Number"
                      className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  {error && <p className="text-red-400 text-xs mt-2 font-medium">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg uppercase tracking-tight hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 group"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            )}

            {step === "password" && (
              <motion.form
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePasswordSubmit}
                className="space-y-6"
              >
                <div>
                  <button 
                    type="button"
                    onClick={() => setStep("phone")}
                    className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 hover:underline"
                  >
                    ← Change Number
                  </button>
                  <h2 className="text-xl font-bold text-white mb-2">Create Password</h2>
                  <p className="text-sm text-slate-500 mb-6">Secure your account with a password</p>
                  
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  {error && <p className="text-red-400 text-xs mt-2 font-medium">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg uppercase tracking-tight hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase mb-2">Success!</h2>
                <p className="text-slate-400">Setting up your dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-8 text-slate-600 text-xs">
          By continuing, you agree to our <span className="text-slate-400 underline cursor-pointer">Terms of Service</span> and <span className="text-slate-400 underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
