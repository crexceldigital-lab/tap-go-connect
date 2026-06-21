import { useRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends HTMLMotionProps<"div"> {
  className?: string;
}

/**
 * Wraps children in a card that tracks the cursor and renders a soft
 * radial highlight under it on hover — a small, low-cost detail that
 * makes cards feel responsive rather than static.
 */
const SpotlightCard = ({ className, children, ...props }: SpotlightCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("spotlight-card", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SpotlightCard;
