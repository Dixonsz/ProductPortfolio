import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

function Sidebar({ items }) {
  return (
    <aside className="sidebar">
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link to={item.href}>{item.label}</Link>
          </li>
        ))}
        </ul>
    </aside>
  );
}

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
        href: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Sidebar;