import { motion } from "framer-motion";
const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg max-w-20">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
        className="h-2 w-2 rounded-full bg-muted-foreground"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
        className="h-2 w-2 rounded-full bg-muted-foreground"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
        className="h-2 w-2 rounded-full bg-muted-foreground"
      />
    </div>
  );
};

export default TypingIndicator;
