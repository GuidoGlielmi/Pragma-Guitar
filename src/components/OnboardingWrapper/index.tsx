import {Steps} from 'intro.js-react';
import {PropsWithChildren, useContext, useEffect, useState} from 'react';
import {LanguageContext, LanguageProps} from '../../contexts/LanguageContext';
import QuestionMark from '../../icons/QuestionMark';
import S from './OnboardingWrapper.module.css';

type OnboardingWrapperProps = {
  steps: StepWithActionAndTranslation[];
  stepsToUpdate?: number[];
};

const OnboardingWrapper = ({
  children,
  steps,
  stepsToUpdate,
}: PropsWithChildren<OnboardingWrapperProps>) => {
  const {eng} = useContext(LanguageContext) as LanguageProps;

  const [enabled, setEnabled] = useState(false);
  const [stepsIntance, setStepsInstance] = useState<Steps | null>(null);

  useEffect(() => {
    if (!stepsIntance || !enabled) return;
    stepsToUpdate?.forEach(i => {
      stepsIntance.updateStepElement(i);
    });
  }, [stepsToUpdate, stepsIntance, enabled]);

  return (
    <div className={S.container}>
      <button onClick={() => setEnabled(true)} title='Learn more'>
        <QuestionMark />
      </button>
      <Steps
        options={{
          tooltipClass: S.tooltip,
          highlightClass: S.highlight,
        }}
        onChange={(i, el) => {
          if (steps[i].click) {
            (el as HTMLElement).click();
          }
        }}
        ref={steps => setStepsInstance(steps)}
        enabled={enabled}
        steps={steps.map(s => ({...s, intro: s.intro[eng ? 'en' : 'es']}))}
        initialStep={0}
        onExit={() => setEnabled(false)}
      />
      {children}
    </div>
  );
};

export default OnboardingWrapper;
