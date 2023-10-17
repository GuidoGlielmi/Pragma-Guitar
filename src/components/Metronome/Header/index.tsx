const Header = ({input, tapButton}: {input: JSX.Element; tapButton: JSX.Element}) => {
  return (
    <div>
      <h2>
        <span>Beat</span>
        {input}
        {tapButton}
      </h2>
    </div>
  );
};

export default Header;
