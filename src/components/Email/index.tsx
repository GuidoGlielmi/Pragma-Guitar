import Email from '@/icons/Email';
import {AnimatePresence, motion} from 'framer-motion';
import {useState} from 'react';

const EmailButton = () => {
  const [hovered, setHovered] = useState(false);
  const [animating, setAnimating] = useState(false);

  return (
    <a
      onMouseEnter={() => !animating && setHovered(ps => !ps)}
      href='mailto:guidoglielmi@gmail.com'
      style={{
        display: 'flex',
        position: 'fixed',
        zIndex: 100000,
        bottom: 0,
        right: 0,
        margin: 10,
        padding: 10,
        overflow: 'hidden',
        borderRadius: '50%',
        border: '2px solid white',
        boxShadow: 'inset 0 0 5px black',
      }}
    >
      <AnimatePresence mode='wait' initial={false}>
        <motion.div
          style={{display: 'flex'}}
          onAnimationStart={() => setAnimating(true)}
          onAnimationComplete={() => {
            setAnimating(false);
          }}
          key={hovered ? 'hovered' : 'notHovered'}
          initial={{x: '-150%'}}
          animate={{x: '0'}}
          exit={{x: '150%'}}
        >
          <Email />
        </motion.div>
      </AnimatePresence>
    </a>
  );
};

export default EmailButton;
