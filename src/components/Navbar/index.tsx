import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import {routes} from '../../routes';
import S from './NavBar.module.css';

const NavBar = () => {
  const {t} = useTranslation('routes');
  const location = useLocation();

  return (
    <nav className={S.navBar}>
      {routes.map(({path, title}, i) => {
        return (
          <Link to={path} key={path}>
            <button className={`${location.pathname === path ? 'selected' : ''}`} key={i}>
              {t(title)}
            </button>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavBar;
