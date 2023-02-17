import React, {
  useEffect,
  createRef,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import PortalMessageComponent from '../components/portal-message.component';
import { usePortalContext } from '../contexts/portal-context';
const usePortal = () => {
  const { portalShow, setPortalMessage, setPortalShow, portalMessage } =
    usePortalContext();

  useEffect(() => {
    const unmountingTime = setTimeout(() => {
      setPortalMessage('');
      setPortalShow(false);
    }, 3000);
    return () => clearTimeout(unmountingTime);
  }, [portalShow]);

  return portalShow ? <PortalMessageComponent message={portalMessage} /> : null;
};

export default usePortal;
