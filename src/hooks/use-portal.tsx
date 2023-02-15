import React, {
  useEffect,
  createRef,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import PortalMessageComponent from '../components/portal-message.component';
type UsePortalProps = {
  message: string;
};

const usePortal = ({ message }: UsePortalProps) => {
  const [mounted, setMounted] = useState(false);

  const showPortal = () => {
    useEffect(() => {
      const unmountingTime = setTimeout(() => {
        setMounted(false);
      }, 5000);
      setMounted(true);
      return () => clearTimeout(unmountingTime);
    }, []);
    return <PortalMessageComponent message={message} />;
  };
  return showPortal;
};

export default usePortal;
