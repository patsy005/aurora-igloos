import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Layout from './ui/Layout'
import Home from './pages/Home'
import Bookings from './pages/Bookings'
import Igloos from './pages/Igloos'
import Users from './pages/Users'
import Promotions from './pages/Promotions'
import PromoItem from './ui/Promotions/PromoItem'
import CreativeCorner from './pages/CreativeCorner'
import EditBooking from './ui/Bookings/EditBooking'
import Customers from './pages/Customers'
import IglooItem from './ui/Igloos/IglooItem'
import EditIgloo from './ui/Igloos/EditIgloo'
import UserItem from './ui/Users/UserItem'
import EditUser from './ui/Users/EditUser'
import EditPromotion from './ui/Promotions/EditPromotion'

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
				path: '/igloo/:iglooId',
				element: <IglooItem />,
			},
			{
				path: '/igloo/:iglooId/edit',
				element: <EditIgloo />,
			},
			{
				path: '/users',
				element: <Users />,
			},
			{
				path: '/user/:userId',
				element: <UserItem />,
			},
			{
				path: '/users/:userId/edit',
				element: <EditUser />,
			},
			{
				path: '/promotions',
				element: <Promotions />,
			},
			{
				path: '/promotion/:promoId',
				element: <PromoItem />,
			},
			{
				path: '/promotion/:promoId/edit',
				element: <EditPromotion />,
			},
			{
				path: '/customers',
				element: <Customers />,
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
