import { createContext, ReactNode, useState, useContext } from 'react';
import React from 'react';

type PortalContextValue = {
  portalShow: boolean;
  setPortalShow: React.Dispatch<React.SetStateAction<boolean>>;
  portalMessage: string;
  setPortalMessage: React.Dispatch<React.SetStateAction<string>>;
};
type PortalProviderProps = {
  children: ReactNode;
};

const PortalContext = createContext<PortalContextValue>({
  portalShow: false,
  setPortalShow: () => {},
  portalMessage: '',
  setPortalMessage: () => {},
} as PortalContextValue);

export const usePortalContext = () => useContext(PortalContext);

export const PortalProvider = ({ children }: PortalProviderProps) => {
  const [portalShow, setPortalShow] = useState(false);
  const [portalMessage, setPortalMessage] = useState('');

  return (
    <PortalContext.Provider
      value={{ portalShow, setPortalShow, portalMessage, setPortalMessage }}
    >
      {children}
    </PortalContext.Provider>
  );
};
