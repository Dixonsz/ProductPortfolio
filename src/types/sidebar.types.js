import PropTypes from "prop-types";

export const NavItemType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  icon: PropTypes.node,
});

export const NavSectionType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(NavItemType).isRequired,
});

export const SidebarProps = {
    sections: PropTypes.arrayOf(NavSectionType),
}