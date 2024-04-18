import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Header from './Header'
import data from '../../public/data.json'

function Layout() {
    const users = data.users
    const user = users.find((user) => user.id === 103)
	return (
		<div className="row">
			<div className="col-2 col-sm-2 col-md-3 col-lg-2">
				<Nav />
			</div>
			<div className="col-10 col-sm-10 col-md-9 col-lg-10 main-box">
				<main className="main">
                    <Header user={user} />
					<Outlet />
				</main>
				<footer className="footer">
					<div className="copyright">
						<span>
							&copy; <span className="year">2024 </span> | Patrycja Zawadzka
						</span>
					</div>
				</footer>
			</div>
		</div>
	)
}

export default Layout
