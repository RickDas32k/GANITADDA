'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Emil Kowalski & Apple fluid motion tokens
export const springSmooth = {
  type: 'spring' as const,
  damping: 26,
  stiffness: 260,
  mass: 0.9,
};

export const springSnappy = {
  type: 'spring' as const,
  damping: 22,
  stiffness: 340,
};

export const springBouncy = {
  type: 'spring' as const,
  damping: 15,
  stiffness: 300,
};

export const easeOutSub300 = {
  duration: 0.24,
  ease: [0.16, 1, 0.3, 1], // Apple fluid bezier
};

export function FadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = 18;
  const initialVariants = {
    up: { opacity: 0, y: offset },
    down: { opacity: 0, y: -offset },
    left: { opacity: 0, x: offset },
    right: { opacity: 0, x: -offset },
    none: { opacity: 0 },
  };

  return (
    <motion.div
      initial={initialVariants[direction]}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ ...springSmooth, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  staggerChildren = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren: 0.05,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: springSmooth,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingMathSymbols() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  const symbols = [
    { char: 'π', top: '12%', left: '8%', size: 48, duration: 18, delay: 0 },
    { char: '√x', top: '22%', right: '12%', size: 54, duration: 22, delay: 2 },
    { char: '∑', top: '70%', left: '15%', size: 62, duration: 25, delay: 1 },
    { char: '∫', top: '65%', right: '18%', size: 70, duration: 20, delay: 3 },
    { char: 'x²', top: '40%', right: '5%', size: 42, duration: 16, delay: 0.5 },
    { char: 'Δ', top: '80%', right: '35%', size: 44, duration: 19, delay: 2.5 },
    { char: '∞', top: '35%', left: '4%', size: 50, duration: 24, delay: 1.5 },
  ];

  return (
    <div className="hero-symbols" aria-hidden="true">
      {symbols.map((s, i) => (
        <motion.div
          key={i}
          className="floating-symbol"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            fontSize: `${s.size}px`,
          }}
          animate={{
            y: [-12, 14, -12],
            rotate: [-4, 6, -4],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        >
          {s.char}
        </motion.div>
      ))}
    </div>
  );
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 1.2,
  suffix = '',
}: {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(from);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(to);
      return;
    }

    let start = from;
    const end = to;
    const stepTime = Math.max(10, Math.floor((duration * 1000) / (end - start || 1)));
    const timer = setInterval(() => {
      start += Math.ceil((end - from) / 30) || 1;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [from, to, duration, shouldReduceMotion]);

  return (
    <span>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}
