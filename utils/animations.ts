// X1 Payments Animation System

export const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const buttonHover = {
  scale: 1.05,
  boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
  y: -2
};

export const cardHover = {
  scale: 1.02,
  y: -4
};

export const iconHover = {
  scale: 1.1,
  boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)"
};

export const loadingSpinner = {
  animate: { rotate: 360 },
  transition: { duration: 1, repeat: Infinity, ease: "linear" as const }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" as const }
};