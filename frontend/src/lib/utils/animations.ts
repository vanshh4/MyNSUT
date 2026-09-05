export const springs = {
  // Critically damped default (no overshoot)
  default: { type: "spring", bounce: 0, duration: 0.4 },
  
  // Momentum interaction — a little bounce
  bouncy: { type: "spring", bounce: 0.2, duration: 0.4 },

  // For very snappy layout transitions
  snappy: { type: "spring", bounce: 0, duration: 0.25 },
};

export const animations = {
  tapScale: {
    scale: 0.97,
    transition: springs.snappy,
  },
  tapScaleCard: {
    scale: 0.98,
    transition: springs.default,
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: springs.default
    },
  },
  staggerChildren: {
    hidden: {},
    show: { 
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.1 
      } 
    },
  },
};
