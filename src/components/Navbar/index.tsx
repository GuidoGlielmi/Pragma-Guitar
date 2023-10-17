import {Link, useLocation} from 'react-router-dom';
import S from './NavBar.module.css';
import {lazyRoutes} from '../../constants/routes';
import useTranslation from '../../hooks/useTranslation';
import {TranslationKeys} from '../../helpers/translations';

const NavBar = () => {
  const routesTitles = useTranslation(lazyRoutes.map(r => r.title) as TranslationKeys[]);
  const location = useLocation();

  return (
    <nav className={S.navBar}>
      {lazyRoutes.map(({path}, i) => {
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
