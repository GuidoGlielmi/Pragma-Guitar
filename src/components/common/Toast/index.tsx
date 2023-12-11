const Toast = ({message}: {message: string | undefined}) => {
  return <div style={{padding: '10px', borderRadius: '5px'}}>{message}</div>;
};

export default Toast;
