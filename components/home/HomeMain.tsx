"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const HomeMain = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(114, 184, 74, 0.15), transparent 40%)`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(114, 184, 74, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(83, 137, 172, 0.1) 0%, transparent 50%)`,
          }}
        />
      </div>
    </div>
  );
};

export default HomeMain;
