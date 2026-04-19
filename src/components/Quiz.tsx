import { useState } from "react";
import { QuizQuestion } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { cn } from "../lib/utils";

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onClose: () => void;
}

export default function Quiz({ questions, onComplete, onClose }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0));
    }
  };

  if (showResult) {
    return (
      <div className="text-center p-12 bg-slate-900 rounded-[40px] shadow-2xl max-w-md mx-auto border-4 border-slate-800">
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/20">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight">Quiz Completed!</h2>
          <p className="text-slate-400 mt-2 font-bold">You scored {score} out of {questions.length}</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={onClose}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl text-xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 uppercase tracking-tight"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800">
      <div className="bg-slate-800 p-6 border-b border-slate-700 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-400">Question {currentIdx + 1} of {questions.length}</span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300">✕</button>
      </div>
      
      <div className="p-10">
        <h2 className="text-2xl font-black text-slate-100 mb-10 leading-tight">{currentQuestion.question}</h2>
        
        <div className="space-y-5">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = idx === currentQuestion.correctAnswer;
            const isSelected = idx === selectedOption;
            
            let variant = "default";
            if (isAnswered) {
              if (isCorrect) variant = "correct";
              else if (isSelected) variant = "incorrect";
            } else if (isSelected) {
              variant = "selected";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={cn(
                  "w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between text-lg font-bold",
                  variant === "default" && "border-slate-800 hover:border-blue-500 hover:bg-slate-800/50 text-slate-300",
                  variant === "selected" && "border-blue-600 bg-blue-900/20 text-blue-400 shadow-lg shadow-blue-900/20",
                  variant === "correct" && (isSelected ? "border-green-600 bg-green-600 text-white" : "border-green-600/40 bg-green-900/10 text-green-400"),
                  variant === "incorrect" && "border-red-600 bg-red-600 text-white"
                )}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-slate-800 rounded-xl border border-slate-700"
            >
              <p className="text-sm text-slate-400">
                <span className="font-bold text-slate-100">Explanation: </span>
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 bg-slate-800 border-t border-slate-700 flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleCheck}
            disabled={selectedOption === null}
            className="px-12 py-5 bg-blue-600 text-white rounded-2xl text-xl font-black hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-900/20 uppercase tracking-tight"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-12 py-5 bg-blue-600 text-white rounded-2xl text-xl font-black hover:bg-blue-700 flex items-center gap-3 transition-all shadow-xl shadow-blue-900/20 uppercase tracking-tight"
          >
            {currentIdx < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            <ArrowRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
