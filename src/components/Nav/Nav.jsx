import { Link } from 'react-router-dom'
import NavLinkBox from './NavLinkBox'
import { useSelector } from 'react-redux'
import { selectIsAdmin } from '../../slices/authSlice'

function Nav() {
	const isAdmin = useSelector(selectIsAdmin)

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
						<NavLinkBox to="/trips" page="Trips" />
						{isAdmin && <NavLinkBox to="/users" page="Users" />}
						<NavLinkBox to="/employees" page="Employees" />
						<NavLinkBox to="/discounts" page="Discounts" />
						<NavLinkBox to="/customers" page="Customers" /> <NavLinkBox to="/contents" page="Contents" />{' '}
						<NavLinkBox to="/forum" page="Forum" />
					</ul>
				</nav>
			</div>
		</aside>
	)
}

export default Nav
