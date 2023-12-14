import {useContext} from 'react';
import OnboardingWrapper from '@/components/OnboardingWrapper';
import {noteGenerator} from '@/constants/steps';
import NoteGeneratorProvider from '@/contexts/NodeGeneratorContext';
import {AudioContext, AudioProps} from '@/contexts/AudioContext';
import NoteGenerator from '.';

const NoteGeneratorWrapper = () => {
  const {started} = useContext(AudioContext) as AudioProps;

  return (
    <OnboardingWrapper steps={noteGenerator} stepsToUpdate={started ? [12, 13] : undefined}>
      <div className='container'>
        <NoteGeneratorProvider>
          <NoteGenerator />
        </NoteGeneratorProvider>
      </div>
    </OnboardingWrapper>
  );
};

export default NoteGeneratorWrapper;
