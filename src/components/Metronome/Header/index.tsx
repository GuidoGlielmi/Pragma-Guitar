import useTranslation from '../../../hooks/useTranslation';

const Header = ({input, tapButton}: {input: JSX.Element; tapButton: JSX.Element}) => {
  const [beatString] = useTranslation('Beat');

  return (
    <div>
      <h2>
        <span>{beatString}</span>
        {input}
        {tapButton}
      </h2>
    </div>
  );
};

export default Header;
