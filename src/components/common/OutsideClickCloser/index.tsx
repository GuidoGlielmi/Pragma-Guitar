import {PropsWithChildren, useRef} from 'react';

type TOutsideClickCloser = {id: string; close: () => void; shown: boolean; zIndex?: number};

const OutsideClickCloser = ({
  id,
  close,
  shown,
  children,
  zIndex = 10000,
}: PropsWithChildren<TOutsideClickCloser>) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      {shown && (
        <button
          onClick={e => e.currentTarget.id === id && close()}
          ref={containerRef}
          id={id}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            width: '100vw',
            height: '100vh',
            cursor: 'default',
            background: 'transparent',
            zIndex: zIndex - 1,
          }}
          className='button'
        />
      )}
      {children}
    </>
  );
};

export default OutsideClickCloser;
