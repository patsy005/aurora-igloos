import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Layout from './ui/Layout'
import Home from './pages/Home'
import Bookings from './pages/Bookings'
import Igloos from './pages/Igloos'
import Users from './pages/Users'
import Promotions from './pages/Promotions'
import CreativeCorner from './pages/CreativeCorner'
import EditBooking from './ui/Bookings/EditBooking'

const router = createBrowserRouter([
	{
		element: <Layout />,

		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/bookings',
				element: <Bookings />,
			},
			{
				path: '/bookings/:bookingId/edit',
				element: <EditBooking />,
			},
			{
				path: '/igloos',
				element: <Igloos />,
			},
			{
				path: '/users',
				element: <Users />,
			},
			{
				path: '/promotions',
				element: <Promotions />,
			},
			{
				path: '/creative-corner',
				element: <CreativeCorner />,
			},
		],
	},
])

function App() {
	return <RouterProvider router={router}></RouterProvider>
}

export default App
