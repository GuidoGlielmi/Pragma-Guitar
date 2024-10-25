import NoteWithOctave from '@/components/common/NoteWithOctave';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NoteGeneratorContext';
import {throttle} from '@/helpers/timer';
import {AnimatePresence, Variants, motion} from 'framer-motion';
import {useContext, useEffect, useRef, useState} from 'react';

const preventScroll = (e: any) => e.preventDefault();

const throttleHoldTime = 50;
const screenHeightScrollStep = 0.015;

const Note = ({pitch, canScroll}: {pitch: number; canScroll?: boolean}) => {
  const {changeLowerPitch, changeHigherPitch} = useContext(
    NoteGeneratorContext,
  ) as NoteGeneratorProps;

  const prevPitchRef = useRef(pitch);

  const [startY, setStartY] = useState<[number, 'from' | 'to'] | [number]>([0]);

  useEffect(() => {
    if (!startY[0]) return;
    const onDrag = throttle((e: MouseEvent) => {
      if (startY[1] === 'from') onScrollFrom(e.clientY);
      else if (startY[1] === 'to') onScrollTo(e.clientY);
    }, throttleHoldTime);
    document.body.addEventListener('mousemove', onDrag);
    document.body.addEventListener('mouseup', onMouseUp);
    return () => {
      document.body.removeEventListener('mousemove', onDrag);
      document.body.removeEventListener('mouseup', onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startY]);

  const onMouseUp = () => setStartY([0]);

  const onScrollFrom = throttle((clientY: number) => {
    const deltaY = clientY - startY[0];
    if (canScroll) {
      if (Math.abs(deltaY) > document.body.clientHeight * screenHeightScrollStep) {
        setStartY(ps => [clientY, ...(ps.slice(1) as ['from' | 'to'])]);
        changeLowerPitch(ps => ps + (deltaY > 0 ? 1 : -1));
      }
    }
  }, throttleHoldTime);

  const onScrollTo = throttle((clientY: number) => {
    const deltaY = clientY - startY[0];
    if (canScroll) {
      if (Math.abs(deltaY) > document.body.clientHeight * screenHeightScrollStep) {
        setStartY(ps => [clientY, ...(ps.slice(1) as ['from' | 'to'])]);
        changeHigherPitch(ps => ps + (deltaY > 0 ? 1 : -1));
      }
    }
  }, throttleHoldTime);

  // like a x-axis spinning wheel, when scrolling in a certain direction, the value goes in the other
  const onWheel = (e: React.WheelEvent) => onScrollFrom(e.deltaY);
  const onMouseDown = (e: React.MouseEvent) => setStartY([e.clientY, 'from']);

  const onTouchStart = (e: React.TouchEvent) => {
    if (!canScroll) return;
    window.addEventListener('touchmove', preventScroll, {passive: false});
    setStartY([e.touches[0].clientY]);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    onScrollTo(e.touches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!canScroll) return;
    window.removeEventListener('touchmove', preventScroll);
    onMouseUp();
  };

  useEffect(() => {
    prevPitchRef.current = pitch;
  }, [pitch]);

  const isNext = pitch > prevPitchRef.current;

  return (
    <div
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence initial={false} custom={isNext}>
        <motion.div
          variants={variants}
          key={pitch}
          custom={isNext}
          initial='enter'
          animate='center'
          exit='exit'
        >
          <NoteWithOctave pitch={pitch} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const variants = {
  enter: (isNext: boolean) => {
    return {
      x: '-50%',
      y: `${isNext ? '-' : ''}200%`,
      rotateX: isNext ? 90 : -90,
    };
  },
  center: {
    x: '-50%',
    y: '-50%',
    rotateX: 0,
  },
  exit: (isNext: boolean) => {
    return {
      x: '-50%',
      y: `${!isNext ? '-' : ''}200%`,
      rotateX: isNext ? -90 : 90,
    };
  },
} as Variants;

export default Note;
