"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function IntroLoader() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("df-intro-done") === "1") {
      setShow(false);
      return;
    }
    const start = Date.now();
    const total = 1800;
    const id = setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - start) / total) * 100));
      setProgress(p);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => {
          sessionStorage.setItem("df-intro-done", "1");
          setShow(false);
        }, 250);
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] grid place-items-center bg-white"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -45 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            >
              <Image src="/logo.svg" alt="Deepframe" width={220} height={300} priority />
            </motion.div>
            <div className="mt-10 h-1 w-56 overflow-hidden rounded-full bg-df-cream">
              <motion.div
                className="h-full bg-df-blue"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <p className="mt-3 font-display italic text-df-blue/70 text-sm">{progress}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
