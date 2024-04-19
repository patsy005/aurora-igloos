import { Link } from 'react-router-dom'
import NavLinkBox from './NavLinkBox'

function Nav() {
	return (
		<aside className="aside position-relative">
			<div className="nav-box">
				<Link to="/" className="logo">
					<img src="/images/logo.png" alt="" />
					<p className="d-none d-md-block">Aurora Igloos</p>
				</Link>

				<nav className="nav">
					<ul className="nav-list">
						<NavLinkBox to="/" page="Home" />
						<NavLinkBox to="/bookings" page="Bookings" />
						<NavLinkBox to="/igloos" page="Igloos" />
						<NavLinkBox to="/users" page="Users" />
						<NavLinkBox to="/promotions" page="Promo" />
						<NavLinkBox to="/creative-corner" page="Creative" />
					</ul>
				</nav>
			</div>
		</aside>
	)
}

export default Nav
