import {useContext, useEffect, useState} from 'react';
import {NoteGeneratorContext, NoteGeneratorProps} from '@/contexts/NodeGeneratorContext';
import {MAX_PITCH_INDEX} from '@/constants/notes';
import Note from './Note';
import {throttle} from '@/helpers/timer';

const preventScroll = (e: any) => e.preventDefault();

const throttleHoldTime = 50;
const screenHeightScrollStep = 0.015;

const NoteRangeToPlay = ({canScroll}: {canScroll?: boolean}) => {
  const {
    changePitchRange,
    pitchRange: [from, to],
  } = useContext(NoteGeneratorContext) as NoteGeneratorProps;

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
        changePitchRange(ps => [ps[0] + (deltaY > 0 ? 1 : -1), ps[1]]);
      }
    }
  }, throttleHoldTime);

  const onScrollTo = throttle((clientY: number) => {
    const deltaY = clientY - startY[0];
    if (canScroll) {
      if (Math.abs(deltaY) > document.body.clientHeight * screenHeightScrollStep) {
        setStartY(ps => [clientY, ...(ps.slice(1) as ['from' | 'to'])]);
        changePitchRange(ps => [ps[0], ps[1] + (deltaY > 0 ? 1 : -1)]);
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

  return (
    <div className='rangeToPlayContainer'>
      <div
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Note pitch={from ?? 0} />
      </div>
      -
      <div
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Note pitch={to ?? MAX_PITCH_INDEX} />
      </div>
    </div>
  );
};

export default NoteRangeToPlay;
