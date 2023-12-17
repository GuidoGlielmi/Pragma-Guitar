import {useContext, useEffect, useState} from 'react';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import {MAX_PITCH_INDEX} from '@/constants/notes';
import Note from './Note';
import {throttle} from '@/helpers/timer';
const preventScroll = (e: any) => e.preventDefault();

const throttleHoldTime = 50;

const NoteRangeToPlay = ({canScroll}: {canScroll?: boolean}) => {
  const {
    changePitchRange,
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [startY, setStartY] = useState<[number, 'from' | 'to'] | [number]>([0]);

  useEffect(() => {
    const onDrag = throttle((e: MouseEvent) => {
      if (startY[1] === 'from') onScrollFrom(e.clientY - startY[0]);
      else if (startY[1] === 'to') onScrollTo(e.clientY - startY[0]);
    }, 50);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startY]);

  const onMouseUp = () => setStartY([0]);

  const onScrollFrom = throttle((deltaY: number) => {
    canScroll && changePitchRange(ps => [ps[0] + (deltaY > 0 ? 1 : -1), ps[1]]);
  }, throttleHoldTime);

  const onScrollTo = throttle((deltaY: number) => {
    canScroll && changePitchRange(ps => [ps[0], ps[1] + (deltaY > 0 ? 1 : -1)]);
  }, throttleHoldTime);

  return (
    <div className='rangeToPlayContainer'>
      <div
        // like a x-axis spinning wheel, when scrolling in a certain direction, the value goes in the other
        onWheel={e => onScrollFrom(e.deltaY)}
        onMouseDown={e => {
          setStartY([e.clientY, 'from']);
        }}
        onTouchStart={e => {
          if (!canScroll) return;
          window.addEventListener('touchmove', preventScroll, {passive: false});
          setStartY([e.touches[0].clientY]);
        }}
        onTouchMove={e => {
          onScrollFrom(e.touches[0].clientY - startY[0]);
        }}
        onTouchEnd={() => {
          canScroll && window.removeEventListener('touchmove', preventScroll);
          onMouseUp();
        }}
      >
        <Note pitch={from ?? 0} />
      </div>
      -
      <div
        onWheel={e => onScrollTo(e.deltaY)}
        onMouseDown={e => {
          setStartY([e.clientY, 'to']);
        }}
        onTouchStart={e => {
          if (!canScroll) return;
          window.addEventListener('touchmove', preventScroll, {passive: false});
          setStartY([e.touches[0].clientY]);
        }}
        onTouchMove={e => {
          onScrollTo(e.touches[0].clientY - startY[0]);
        }}
        onTouchEnd={() => {
          canScroll && window.removeEventListener('touchmove', preventScroll);
          onMouseUp();
        }}
      >
        <Note pitch={to ?? MAX_PITCH_INDEX} />
      </div>
    </div>
  );
};

export default NoteRangeToPlay;
