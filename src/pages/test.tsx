import { useEffect, useState } from 'react';
import PortalMessageComponent from '../components/portal-message.component';

import usePortal from '../hooks/use-portal';

import styles from '../styles/Test.module.scss';

const Test = () => {
  const showPortal = usePortal({ message: 'good luck' });

  return (
    <div>
      <button
        style={{
          height: 100,
          width: 100,
        }}
        onClick={() => {
          showPortal();
        }}
      >
        show portal
      </button>
      <div className={styles.box_1}></div>
      <div className={styles.box_2}></div>
    </div>
  );
};

export default Test;
