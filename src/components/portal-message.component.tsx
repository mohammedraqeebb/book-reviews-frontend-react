import { AnimatePresence, m, motion } from 'framer-motion';
import { FC, RefObject } from 'react';
import Portal from '../hoc/portal';
type PortalComponentProps = {
  message: string;
};

const PortalMessageComponent: FC<PortalComponentProps> = ({ message }) => {
  if (message === '') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{
          y: '-100',
          opacity: 0,
          transition: { duration: 0.2, ease: 'ease-in-out' },
        }}
        style={{
          width: '180px',
          height: 'auto',
          minHeight: '40px',
          border: '1px solid #000011',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          padding: '10',
          transform: 'translateX(-50%)',
          userSelect: 'none',
          background: '#273c75',
          color: 'white',
          fontSize: '10',
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        }}
      >
        <p style={{ fontSize: '12px' }}>{message}</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default Portal(PortalMessageComponent);
