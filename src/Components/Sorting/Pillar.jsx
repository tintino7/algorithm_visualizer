import { motion } from "framer-motion";
import { forwardRef } from "react";

const Pillar = forwardRef(({ id, className, height }, ref) => {
  const springAnim = {
    type: "spring",
    damping: 25,
    stiffness: 150,
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      layout
      transition={springAnim}
      style={{ height: height }}
    >
      {height}
    </motion.div>
  );
});

export default Pillar;
