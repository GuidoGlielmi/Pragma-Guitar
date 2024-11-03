import Email from '@/icons/Email';
import {AnimatePresence, motion} from 'framer-motion';
import {useState} from 'react';
import S from '../Social.module.css';

const EmailButton = () => {
  const [hovered, setHovered] = useState(false);
  const [animating, setAnimating] = useState(false);

  return (
    <a
      className={S.emailContainer}
      onMouseEnter={() => !animating && setHovered(ps => !ps)}
      href='mailto:guidoglielmi@gmail.com'
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
