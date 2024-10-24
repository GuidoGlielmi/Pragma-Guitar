import {Steps} from 'intro.js-react';
import {PropsWithChildren, useContext, useState} from 'react';
import {LanguageContext, LanguageProps} from '../../contexts/LanguageContext';
import QuestionMark from '../../icons/QuestionMark';
import S from './OnboardingWrapper.module.css';

type OnboardingWrapperProps = {
  steps: StepWithActionAndTranslation[];
};

const OnboardingWrapper = ({children, steps}: PropsWithChildren<OnboardingWrapperProps>) => {
  const {eng} = useContext(LanguageContext) as LanguageProps;

  const [enabled, setEnabled] = useState(false);
  const [stepsInstance, setStepsInstance] = useState<Steps | null>(null);

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
          if (steps[i].updatable) {
            stepsInstance!.updateStepElement(i);
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
