import {useContext, useState} from 'react';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import {MAX_PITCH_INDEX} from '@/constants/notes';
import Note from './Note';
const preventScroll = (e: any) => e.preventDefault();

const NoteRangeToPlay = ({canScroll}: {canScroll?: boolean}) => {
  const {
    changePitchRange,
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

  const [startY, setStartY] = useState(0);

  const onScrollFrom = (deltaY: number) => {
    canScroll && changePitchRange(ps => [ps[0] + (deltaY > 0 ? 1 : -1), ps[1]]);
  };

  const onScrollTo = (deltaY: number) => {
    canScroll && changePitchRange(ps => [ps[0], ps[1] + (deltaY > 0 ? 1 : -1)]);
  };

  return (
    <div className='rangeToPlayContainer'>
      <div
        // like a x-axis spinning wheel, when scrolling in a certain direction, the value goes in the other
        onWheel={e => onScrollFrom(e.deltaY)}
        onTouchStart={e => {
          if (!canScroll) return;
          window.addEventListener('touchmove', preventScroll, {passive: false});
          setStartY(e.touches[0].clientY);
        }}
        onTouchMove={e => {
          onScrollFrom(e.touches[0].clientY - startY);
        }}
        onTouchEnd={() => {
          canScroll && window.removeEventListener('touchmove', preventScroll);
        }}
      >
        <Note pitch={from ?? 0} />
      </div>
      -
      <div
        onWheel={e => onScrollTo(e.deltaY)}
        onTouchStart={e => {
          if (!canScroll) return;
          window.addEventListener('touchmove', preventScroll, {passive: false});
          setStartY(e.touches[0].clientY);
        }}
        onTouchMove={e => {
          onScrollTo(e.touches[0].clientY - startY);
        }}
        onTouchEnd={() => {
          canScroll && window.removeEventListener('touchmove', preventScroll);
        }}
      >
        <Note pitch={to ?? MAX_PITCH_INDEX} />
      </div>
    </div>
  );
};

export default NoteRangeToPlay;
