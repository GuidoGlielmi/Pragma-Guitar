import {LazyMotion, domAnimation, m} from 'framer-motion';
import {Suspense} from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {Outlet} from 'react-router-dom';

const SuspensedSection = () => {
  return (
    <Suspense fallback={<Skeleton width='min(95vw, 400px, 100%)' height='min(50vh, 500px)' />}>
      <LazyMotion features={domAnimation}>
        <m.div
          key={location.pathname}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.25}}
        >
          <Outlet /> {/* All the routes */}
        </m.div>
      </LazyMotion>
    </Suspense>
  );
};

export default SuspensedSection;
