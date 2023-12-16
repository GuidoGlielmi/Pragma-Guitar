import {Suspense} from 'react';
import {m, LazyMotion, domAnimation} from 'framer-motion';
import {Outlet} from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Sections = () => {
  return (
    <Suspense fallback={<Skeleton width='min(95vw, 400px)' height='min(50vh, 500px)' />}>
      <LazyMotion features={domAnimation}>
        <m.div
          key={location.pathname}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.25}}
        >
          <Outlet />
        </m.div>
      </LazyMotion>
    </Suspense>
  );
};

export default Sections;
