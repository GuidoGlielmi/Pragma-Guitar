import GithubIcon from '@/icons/GithubIcon';
import S from '../Social.module.css';

const GithubButton = () => {
  return (
    <a
      className={S.githubContainer}
      href='https://github.com/GuidoGlielmi/Pragma-Guitar'
      target='_blank'
      referrerPolicy='no-referrer' // How much of the referrer to send when following the link, through the HTTP Referer request header. It allows a server to identify referring pages that people are visiting from or where requested resources are being used, which can be used for analytics, logging, optimized caching, and more.
    >
      <GithubIcon />
    </a>
  );
};

export default GithubButton;
