'use client';

import {motion, AnimatePresence} from 'motion/react';

const screenVariants = {
  initial: {opacity: 0, x: 20, transition: {duration: 0.15}},
  animate: {opacity: 1, x: 0, transition: {duration: 0.15}},
  exit: {opacity: 0, x: -20, transition: {duration: 0.15}},
};

type Props = {
  children: React.ReactNode;
};

export const MotionWrapper: React.FC<Props> = ({children}) => (
  <AnimatePresence>
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        width: '100%',
        height: '100%',
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </motion.div>
  </AnimatePresence>
);
