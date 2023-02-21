import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './NavLink.module.scss';
interface NavLinkProps {
  to: string;
  name: string;
  currentPath: string;
  activeComponent: JSX.Element;
  inactiveComponent: JSX.Element;
}

const NavLink = ({
  to,
  name,
  currentPath,
  activeComponent,
  inactiveComponent,
}: NavLinkProps) => {
  const myPath = to.slice(1);
  const isActive = currentPath === myPath;

  return (
    <Link
      style={{
        fontWeight: isActive ? 700 : 400,
      }}
      className={styles.navlink_container}
      to={to}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div whileTap={{ scale: 0.6 }}>{activeComponent}</motion.div>
        )}
        {!isActive && (
          <motion.div whileTap={{ scale: 0.6 }}>{inactiveComponent}</motion.div>
        )}
      </AnimatePresence>
      <p className={styles.navlink_name}>{name}</p>
    </Link>
  );
};

export default NavLink;
