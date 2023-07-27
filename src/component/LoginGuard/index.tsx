import { useEffect, useState } from 'react';
import { NavigateOptions, useNavigate } from 'react-router-dom';
import userStore from '@/store/userStore';

interface Props extends BaseProps {
  to?: string;
  config?: NavigateOptions;
}

function LoginGuard(props: Props) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (userStore.isLogin) return setShow(true);
    if (userStore.init || retryCount > 5)
      return navigate(props.to || '/', props.config);
      
    setTimeout(() => {
      setRetryCount((state) => {
        return state + 1;
      });
    }, 250);
  }, [navigate, retryCount, props]);

  return <>{show && props.children}</>;
}

export default LoginGuard;
