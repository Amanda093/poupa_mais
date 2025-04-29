// components/FluidBackground.tsx
"use client";

import { motion } from "framer-motion";

const blobs = [
  {
    color: "from-emerald-400 to-emerald-300",
    top: "-25%",
    left: "-10%",
    delay: 0,
  },
  {
    color: "from-indigo-400 to-indigo-300",
    top: "0%",
    left: "75%",
    delay: 2,
  },
  {
    color: "from-blue-400 to-blue-300",
    top: "75%",
    left: "-10%",
    delay: 5,
  },
  {
    color: "from-emerald-400 to-emerald-300",
    top: "90%",
    left: "100%",
    delay: 1.5,
  },
];

export function FluidBackground() {
  return (
    <div className="absolute top-0 left-0 z-3 size-full overflow-hidden rounded-[2em]">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          initial={{
            scale: 1,
            rotate: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            scale: [1.5, 4, 1.5],
            rotate: [0, 20, -20, 0],
            x: [0, 40, -30, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: blob.delay,
          }}
          className={`absolute h-[30vh] w-[30vh] bg-gradient-to-br ${blob.color} rounded-full opacity-40 mix-blend-screen blur-2xl will-change-transform`}
          style={{
            top: blob.top,
            left: blob.left,
          }}
        />
      ))}
    </div>
  );
}
