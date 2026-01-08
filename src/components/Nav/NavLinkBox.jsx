import { NavLink } from 'react-router-dom'
import {
	CalendarIcon,
	CreativeCornerIcon,
	CustomersIcon,
	HomeIcon,
	IgloosIcon,
	PromoIcon,
	ReportsIcon,
	TripIcon,
	UsersIcon,
} from '../../ui/Icons'

function NavLinkBox({ to, page }) {
	return (
		<li className="nav-item">
			<NavLink to={to} className="nav-link">
				{page === 'Home' && <HomeIcon />}
				{page === 'Bookings' && <CalendarIcon />}
				{page === 'Igloos' && <IgloosIcon />}
				{page === 'Users' && <UsersIcon />}
				{page === 'Employees' && <UsersIcon />}
				{page === 'Discounts' && <PromoIcon />}
				{page === 'Customers' && <CustomersIcon />}
				{page === 'Contents' && <ReportsIcon />}
				{page === 'Forum' && <CreativeCornerIcon />}
				{page === 'Trips' && <TripIcon />}
				<span className="d-none d-md-block">{page}</span>
				<div className="route-box">
					<p>{page}</p>
				</div>
			</NavLink>
		</li>
	)
}

export default NavLinkBox
