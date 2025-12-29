import {Steps} from 'intro.js-react';
import {PropsWithChildren, useState} from 'react';
import {useTranslation} from 'react-i18next';
import QuestionMark from '../../icons/QuestionMark';
import S from './OnboardingWrapper.module.css';

type OnboardingWrapperProps = {
  steps: StepWithActionAndTranslation[];
};

const OnboardingWrapper = ({children, steps}: PropsWithChildren<OnboardingWrapperProps>) => {
  const {t} = useTranslation('noteGeneratorOnboarding');
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
        steps={steps.map((s, i) => ({
          ...s,
          title: t((i + '.title') as any),
          intro: t((i + '.description') as any),
        }))}
        initialStep={0}
        onExit={() => setEnabled(false)}
      />
      {children}
    </div>
  );
};

export default OnboardingWrapper;
