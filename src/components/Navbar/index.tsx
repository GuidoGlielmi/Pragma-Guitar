import {Link} from 'react-router-dom';
import S from './NavBar.module.css';
import {routes} from '../../constants/routes';
import useTranslation from '../../hooks/useTranslation';
import {TranslationKeys} from '../../helpers/translations';

const NavBar = () => {
  const routesTitles = useTranslation(routes.map(r => r.title) as TranslationKeys[]);

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
