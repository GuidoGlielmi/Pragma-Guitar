import {Link} from 'react-router-dom';
import S from './NavBar.module.css';
import {routes} from '../../constants/routes';

const NavBar = () => {
  return (
    <nav className={S.navBar}>
      {routes.map(({title, path}, i) => {
        return (
          <Link to={path} key={path}>
            <button className={`${location.pathname === path ? 'selected' : ''}`} key={i}>
              {title}
            </button>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavBar;
