import { Outlet } from 'react-router-dom'
import Nav from './Nav/Nav'
import Header from '../components/Header'
import data from '../../public/data.json'
import Footer from '../components/Footer'
import { Toaster } from 'react-hot-toast'

function Layout() {
	const users = data.users
	const user = users.find(user => user.id === 103)
	return (
		<div className="row">
			<div className="col-2 col-sm-2 col-md-3 col-lg-2 nav-bg">
				<Nav />
			</div>
			<div className="col-10 col-sm-10 col-md-9 col-lg-10 main-box">
				<main className="main">
					<Toaster
						position="top-center"
						gutter={12}
						containerStyle={{ margin: '8px'}}
						toastOptions={{
							success: {
								duration: 5000,
								// duration: Infinity,
							},
							style: {
								fontSize: '16px',
								maxWidth: '500px',
								padding: '16px 24px',
								backgroundColor: '#003c43',
								color: '#cffaff',
								border: "1px solid #b8f8ff",
								gap: '8px',
							},
							iconTheme: {
								primary: '#b8f8ff',
								secondary: '#003c43',
							},
							// className: "toast"
						}}
						
					/>
					<Header user={user} />
					<Outlet />
				</main>
				<Footer />
			</div>
		</div>
	)
}

export default Layout
