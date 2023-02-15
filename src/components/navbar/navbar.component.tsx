import React, { FC, useEffect, useState, MouseEvent } from 'react';
import styles from './Navbar.module.scss';

import { Link, useLocation } from 'react-router-dom';

import HomeActiveIcon from '../../static/assets/icons/home-active.icon ';
import NavLink from '../navlink/navlink.component';
import HomeIcon from '../../static/assets/icons/home.icon';
import SearchIcon from '../../static/assets/icons/search-icon';
import SearchActiveIcon from '../../static/assets/icons/search-active..icon';
import SavedActiveIcon from '../../static/assets/icons/saved-active.icon';
import SavedIcon from '../../static/assets/icons/saved.icon';
import PostActiveIcon from '../../static/assets/icons/post-active.icon';
import PostIcon from '../../static/assets/icons/post.icon';
import ProfileActiveIcon from '../../static/assets/icons/profile-active.icon';
import ProfileIcon from '../../static/assets/icons/profile.icon';
import { useAppSelector } from '../../app/hooks';
import Logo from '../../static/assets/icons/logo.icon';

const Navbar = () => {
  const [currentPath, setCurrentPath] = useState('');
  const location = useLocation();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    setCurrentPath(location.pathname.slice(1));
  }, [location.pathname]);
  return (
    <div className={styles.navbar_wrapper}>
      <div className={styles.navbar_container}>
        <Link to="/" className={styles.logo_container}>
          <Logo />
        </Link>
        <nav className={styles.navbar_links}>
          <NavLink
            to="/"
            currentPath={currentPath}
            name="Home"
            activeComponent={<HomeActiveIcon />}
            inactiveComponent={<HomeIcon />}
          />
          <NavLink
            to="/search"
            name="search"
            currentPath={currentPath}
            activeComponent={<SearchActiveIcon />}
            inactiveComponent={<SearchIcon />}
          />
          {user && (
            <NavLink
              to="/saved"
              name="Saved"
              currentPath={currentPath}
              activeComponent={<SavedActiveIcon />}
              inactiveComponent={<SavedIcon />}
            />
          )}
          {user && (
            <NavLink
              to="/post"
              name="post"
              currentPath={currentPath}
              activeComponent={<PostActiveIcon />}
              inactiveComponent={<PostIcon />}
            />
          )}
          <NavLink
            to={user ? '/profile' : '/auth/signin'}
            name="profile"
            currentPath={currentPath}
            activeComponent={<ProfileActiveIcon />}
            inactiveComponent={<ProfileIcon />}
          />
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
