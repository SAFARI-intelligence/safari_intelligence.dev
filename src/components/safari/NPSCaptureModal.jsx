import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function NPSCaptureModal({ isVisible, onClose }) {
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  const getScoreStyle = (n) => {
    if (n <= 6) return { border: "#8B1A1A", text: "#8B1A1A", bg: "#8B1A1A" };
    if (n <= 8) return { border: "#C9A84C", text: "#C9A84C", bg: "#C9A84C" };
    return { border: "#2D5A27", text: "#2D5A27", bg: "#2D5A27" };
  };

  const getPlaceholder = () => {
    if (score === null) return "";
    if (score <= 6) return "What would make SAFARI better for you?";
    if (score <= 8) return "What's one thing we could improve?";
    return "What did you love most?";
  };

  const handleSubmit = () => {
    console.log({
      score,
      comment,
      timestamp: new Date().toISOString(),
    });
    setScore(null);
    setComment("");
    onClose();
  };

  const handleSkip = () => {
    setScore(null);
    setComment("");
    onClose();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleSkip}
          />
          <motion.div
            className="relative w-full max-w-md glass-strong rounded-2xl p-6 sm:p-8 space-y-6"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-foreground/5 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight pr-6">
                How likely are you to book your Kenya safari through SAFARI?
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 11 }, (_, i) => i).map((n) => {
                  const style = getScoreStyle(n);
                  const isSelected = score === n;
                  return (
                    <button
                      key={n}
                      onClick={() => setScore(n)}
                      className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 font-semibold text-sm transition-all duration-200 flex items-center justify-center"
                      style={{
                        borderColor: style.border,
                        backgroundColor: isSelected ? style.bg : "transparent",
                        color: isSelected ? "#ffffff" : style.text,
                      }}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Not likely</span>
                <span>Extremely likely</span>
              </div>
            </div>

            <AnimatePresence>
              {score !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={getPlaceholder()}
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background/50 p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={score === null}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "#C9A84C",
                  color: "#1A1209",
                }}
              >
                Submit Feedback
              </button>
              <button
                onClick={handleSkip}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
