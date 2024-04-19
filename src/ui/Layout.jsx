import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Header from './Header'
import data from '../../public/data.json'

function Layout() {
    const users = data.users
    const user = users.find((user) => user.id === 103)
	return (
		// <div className="row">
        <div className='layout-container'>
			<div className="nav-bg">
				<Nav />
			</div>
			<div className="main-box">
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
		{/* </div> */}
        </div>
	)
}

export default Layout
