const Toast = ({message}: {message: string | undefined}) => {
  return (
    <div
      style={{
        position: 'fixed',
        padding: '10px',
        margin: '10px',
        bottom: '0',
        left: '0',
        background:
          'linear-gradient(to bottom, rgb(179, 85, 85), rgb(141, 59, 59), rgb(179, 85, 85))',
        borderRadius: '5px',
        zIndex: 100000,
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
