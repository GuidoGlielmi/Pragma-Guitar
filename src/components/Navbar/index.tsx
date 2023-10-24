import {Link, useLocation} from 'react-router-dom';
import {routes} from '../../constants/routes';
import useTranslation from '../../hooks/useTranslation';
import S from './NavBar.module.css';

const NavBar = () => {
  const routesTitles = useTranslation(routes.map(r => r.title));
  const location = useLocation();

  return (
    <nav className={S.navBar}>
      {routes.map(({path}, i) => {
        return (
          <Link to={path} key={path}>
            <button className={`${location.pathname === path ? 'selected' : ''}`} key={i}>
              {routesTitles[i]}
            </button>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavBar;
