import EmailButton from './Email';
import GithubButton from './GithubButton';
import S from './Social.module.css';

const Social = () => {
  return (
    <div className={S.container}>
      <GithubButton />
      <EmailButton />
    </div>
  );
};

export default Social;
