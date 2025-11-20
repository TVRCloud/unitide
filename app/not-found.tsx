"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(600px circle at ${
              50 + mousePosition.x
            }% ${
              50 + mousePosition.y
            }%, rgba(114, 184, 74, 0.15), transparent 40%)`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{
              rotateY: [0, 10, -10, 0],
              rotateX: [0, -10, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            <h1
              className={`text-[12rem] md:text-[16rem] font-black leading-none relative ${
                glitchActive ? "glitch" : ""
              }`}
            >
              <span className="bg-linear-to-br from-primary via-secondary to-primary bg-clip-text text-transparent">
                404
              </span>
              {glitchActive && (
                <>
                  <span className="absolute inset-0 bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent opacity-70 glitch-layer-1">
                    404
                  </span>
                  <span className="absolute inset-0 bg-linear-to-br from-secondary to-primary bg-clip-text text-transparent opacity-70 glitch-layer-2">
                    404
                  </span>
                </>
              )}
            </h1>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-2xl mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lost in the digital void
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-2">
            The page you&apos;re looking for has drifted into the unknown
          </p>
          <p className="text-muted-foreground">
            Don&apos;t worry, even the best explorers lose their way sometimes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg flex items-center gap-2 hover:shadow-2xl hover:shadow-primary/30 transition-all group"
          >
            <Home className="w-5 h-5" />
            Back to Home
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0%,
          100% {
            transform: translate(0);
          }
          33% {
            transform: translate(-2px, 2px);
          }
          66% {
            transform: translate(2px, -2px);
          }
        }

        .glitch {
          animation: glitch 0.3s infinite;
        }

        .glitch-layer-1 {
          animation: glitch 0.3s infinite;
          animation-delay: 0.05s;
          left: 2px;
        }

        .glitch-layer-2 {
          animation: glitch 0.3s infinite;
          animation-delay: 0.1s;
          left: -2px;
        }
      `}</style>
    </div>
  );
}
