import { NavLink } from 'react-router-dom'
import { CalendarIcon, CreativeCornerIcon, CustomersIcon, HomeIcon, IgloosIcon, PromoIcon, UsersIcon } from '../Icons'

function NavLinkBox({ to, page }) {
	return (
		<li className="nav-item">
			<NavLink to={to} className="nav-link">
				{page === 'Home' && <HomeIcon />}
				{page === 'Bookings' && <CalendarIcon />}
				{page === 'Igloos' && <IgloosIcon />}
				{page === 'Users' && <UsersIcon />}
				{page === 'Employees' && <UsersIcon />}
				{page === 'Promo' && <PromoIcon />}
				{page === 'Forum' && <CreativeCornerIcon />}
				{page === 'Customers' && <CustomersIcon />} 
				<span className="d-none d-md-block">{page}</span>
				<div className="route-box">
					<p>{page}</p>
				</div>
			</NavLink>
		</li>
	)
}

export default NavLinkBox
