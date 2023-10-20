import {createContext, useMemo, useState, PropsWithChildren, Dispatch, SetStateAction} from 'react';
import Toast from '../../components/common/Toast';
import {AnimatePresence, motion} from 'framer-motion';

type TToastMessage = [message: string, duration: number] | undefined;

export interface ToastProps {
  setMessage: Dispatch<SetStateAction<TToastMessage>>;
  message: TToastMessage;
}
type ToastProviderProps = {children: React.ReactNode};

const showString = 'show';
const hideString = 'hide';

export const ToastContext = createContext<ToastProps | null>(null);

const ToastProvider = ({children}: PropsWithChildren<ToastProviderProps>) => {
  const [message, setMessage] = useState<TToastMessage | undefined>();
  const [delayedMessage, setDelayedMessage] = useState<string | undefined>();
  const contextValue = useMemo(() => ({setMessage, message}), [message]);

  return (
    <ToastContext.Provider value={contextValue}>
      <AnimatePresence onExitComplete={() => setDelayedMessage(message?.[0])}>
        <motion.div
          onAnimationStart={a => {
            if (a === showString) {
              setDelayedMessage(message?.[0]);
              if (message !== undefined && message[1] !== -1)
                setTimeout(() => setMessage(undefined), message[1]);
            }
          }}
          variants={{show: showAnimation, hide: hideAnimation}}
          animate={message?.[0] ? showString : hideString}
        >
          <Toast message={delayedMessage} />
        </motion.div>
      </AnimatePresence>
      {children}
    </ToastContext.Provider>
  );
};

const showAnimation = {opacity: 1};
const hideAnimation = {opacity: 0};

export default ToastProvider;
