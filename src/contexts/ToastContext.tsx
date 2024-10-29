import {Translation} from '@/helpers/translations';
import useTranslation from '@/hooks/useTranslation';
import {motion} from 'framer-motion';
import {PropsWithChildren, createContext, useMemo, useRef, useState} from 'react';
import Toast from '../components/common/Toast';

interface IToastOptions {
  message: keyof Translation | '';
  /** In ms. `duration: -1` means infinite duration */
  duration?: number;
}
type TToastOptionsWithShow = IToastOptions & {show: boolean};

const initialToastOptions = {message: '' as const, duration: 0, show: false};

export interface ToastProps {
  /** `duration: -1` means infinite duration */
  setToastOptions: (toastOptions: IToastOptions) => void;
  close: (closer?: (message: string) => boolean) => void;
}

const showString = 'show';
const hideString = 'hide';

export const ToastContext = createContext<ToastProps | null>(null);

const ToastProvider = ({children}: PropsWithChildren) => {
  const [toastOptions, setToastOptions] = useState<TToastOptionsWithShow>(initialToastOptions);
  const [translatedMessage] = useTranslation(toastOptions.message);

  const toastMessageRef = useRef(toastOptions.message);
  const closeTimeoutRef = useRef<number>();

  const setToastOptionsHandler = (to: IToastOptions) => {
    clearTimeout(closeTimeoutRef.current);
    setToastOptions({...to, show: true});
    toastMessageRef.current = to.message;
    if (to.duration !== -1) {
      closeTimeoutRef.current = setTimeout(
        () => setToastOptions(ps => ({...ps, show: false})),
        to?.duration || 5000,
      );
    }
  };

  const close = (closer?: (message: string) => boolean) => {
    if (toastOptions.show) return;
    if (closer === undefined || closer(toastMessageRef.current)) {
      clearTimeout(closeTimeoutRef.current);
      setToastOptions(ps => ({...ps, show: false}));
    }
  };

  const contextValue = useMemo(
    () => ({setToastOptions: setToastOptionsHandler, close}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      <motion.div
        style={{
          position: 'fixed',
          margin: 10,
          bottom: 0,
          left: 0,
          background:
            'linear-gradient(to bottom, rgb(179, 85, 85), rgb(141, 59, 59), rgb(179, 85, 85))',
          borderRadius: 5,
          zIndex: 100000,
          opacity: 0,
        }}
        transition={{duration: 0.2}}
        variants={{[showString]: showAnimation, [hideString]: hideAnimation}}
        animate={toastOptions.show ? showString : hideString}
      >
        <Toast message={translatedMessage} />
      </motion.div>
      {children}
    </ToastContext.Provider>
  );
};

const showAnimation = {x: 0, opacity: 1};
const hideAnimation = {x: -10, opacity: 0};

export default ToastProvider;
