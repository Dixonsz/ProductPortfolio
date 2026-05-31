import PropTypes from 'prop-types';
import {Sidebar} from './Sidebar';

export const Dashboard = ({children, links, logo}) => {
    return (
        <div className="dashboard">
            <div className="dashboard-content">
                <Sidebar  links = {links} logo = {logo} />
                <main>
                    {children}
                </main>
            </div>
        </div>
    )

}

Dashboard.propTypes = {
    children: PropTypes.node.isRequired,
    links: PropTypes.arrayOf(
        PropTypes.shape({
            href: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    ).isRequired,
    logo: PropTypes.string.isRequired
};

export default Dashboard;

