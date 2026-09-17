import { motion } from "motion/react";

type Mood = "happy" | "thinking" | "celebrate" | "sleep" | "confused" | "rolling";

export function ShuffMascot({ mood = "happy", size = "medium" }: { mood?: Mood; size?: "small" | "medium" | "large" }) {
  return (
    <motion.div
      className={`shuff shuff--${size} shuff--${mood}`}
      animate={mood === "rolling" ? { rotate: [0, -13, 16, -8, 0], y: [0, -12, 0, -6, 0] } : undefined}
      transition={{ duration: 0.72, repeat: mood === "rolling" ? Infinity : 0, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <span className="shuff__shadow" />
      <span className="shuff__body">
        <span className="shuff__dot shuff__dot--one" />
        <span className="shuff__dot shuff__dot--two" />
        <span className="shuff__dot shuff__dot--three" />
        <span className="shuff__dot shuff__dot--four" />
        <span className="shuff__mouth" />
      </span>
      {mood === "celebrate" && <><i className="spark spark--one">✦</i><i className="spark spark--two">●</i><i className="spark spark--three">◆</i></>}
      {mood === "thinking" && <i className="thought">?</i>}
      {mood === "sleep" && <i className="zzz">zZ</i>}
    </motion.div>
  );
}
