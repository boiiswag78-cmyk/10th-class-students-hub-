import { GraduationCap, Phone, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import { ConfirmationResult } from "firebase/auth";

export default function Auth() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConfigError, setIsConfigError] = useState(false);

  useEffect(() => {
    if (!auth) return;
    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response: any) => {
            console.log("reCAPTCHA resolved");
          }
        });
      }
    } catch (err) {
      console.error("Recaptcha init failed:", err);
    }
    
    return () => {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        } catch (e) {}
      }
    };
  }, []);

  const handleSendCode = async () => {
    let finalPhone = phoneNumber.trim();
    if (!finalPhone.startsWith('+')) {
      finalPhone = `+91${finalPhone}`;
    }
    
    if (finalPhone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");
    setIsConfigError(false);
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      if (!appVerifier) {
        throw new Error("reCAPTCHA not initialized. Please refresh the page.");
      }
      const confirmation = await signInWithPhoneNumber(auth, finalPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      console.error("Auth Error Details:", err);
      // Catch variants of the error code or message
      if (err.code === 'auth/operation-not-allowed' || 
          (err.message && err.message.toLowerCase().includes('operation-not-allowed'))) {
        setIsConfigError(true);
        setError("Phone Login is currently disabled in your Firebase project.");
      } else {
        setError(err.message || "Failed to send code. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const consoleLink = `https://console.firebase.google.com/project/gen-lang-client-0317114435/authentication/providers`;

  const handleVerifyCode = async () => {
    if (!confirmationResult) return;
    setLoading(true);
    setError("");
    try {
      await confirmationResult.confirm(verificationCode);
    } catch (err: any) {
      console.error(err);
      setError("Invalid code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div id="recaptcha-container"></div>
      
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
          <p className="text-slate-400 font-medium tracking-tight">Your ultimate study companion</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
              {confirmationResult ? "Check your phone" : "Hi, Welcome Back!"}
            </h2>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              {confirmationResult 
                ? `Enter the 6-digit code sent to ${phoneNumber}`
                : "Enter your phone number to continue your journey."
              }
            </p>
          </div>

          <div className="space-y-4">
            {!confirmationResult ? (
              <>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-700 pr-3 mr-3">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300 font-bold">+91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phoneNumber}
                    maxLength={10}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, ''));
                      setError("");
                      setIsConfigError(false);
                    }}
                    className="w-full pl-24 pr-4 py-4 bg-slate-950 border border-slate-700 rounded-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all text-lg font-bold tracking-widest"
                  />
                </div>

                {isConfigError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl"
                  >
                    <p className="text-red-400 text-xs font-bold leading-relaxed mb-3">
                      ⚠️ ACTION REQUIRED: Phone Authentication must be enabled in your Firebase Console.
                    </p>
                    <a 
                      href={consoleLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full py-2 bg-red-600 text-white text-[10px] font-black uppercase text-center rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Open Firebase Console
                    </a>
                  </motion.div>
                )}

                {!isConfigError && error && <p className="text-red-400 text-xs font-bold px-2">{error}</p>}
                
                <button
                  onClick={handleSendCode}
                  disabled={loading || !phoneNumber}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg uppercase tracking-tight hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      Send OTP <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-700 rounded-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all text-2xl font-black tracking-[0.5em] text-center"
                  />
                </div>
                {error && <p className="text-red-400 text-xs font-bold px-2">{error}</p>}
                <button
                  onClick={handleVerifyCode}
                  disabled={loading || verificationCode.length < 6}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg uppercase tracking-tight hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Sign In"}
                </button>
                <button 
                  onClick={() => setConfirmationResult(null)}
                  className="w-full text-slate-500 text-sm font-bold hover:text-slate-400 transition-colors py-2"
                >
                  Change phone number
                </button>
              </>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
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
