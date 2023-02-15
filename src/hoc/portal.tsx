import { createPortal } from 'react-dom';
import React, { FC, RefObject, useEffect, useState } from 'react';

type PortalComponentProps = {
  message: string;
};

const Portal =
  (PortalComponent: FC<PortalComponentProps>) =>
  ({ message }: PortalComponentProps) => {
    // const [mounted, setMounted] = useState(false);
    // useEffect(() => {
    //   const unmountingTime = setTimeout(() => {
    //     setMounted(false);
    //   }, 5000);
    //   setMounted(true);

    //   return () => {
    //     setMounted(false);
    //     clearTimeout(unmountingTime);
    //   };
    // }, []);
    return createPortal(
      <PortalComponent message={message} />,
      document.querySelector('#portal_root') as HTMLElement
    );
  };

export default Portal;
