import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Layout from './ui/Layout'
import Home from './pages/Home'
import Bookings from './pages/Bookings'
import Igloos from './pages/Igloos'
import Users from './pages/Users'
import Promotions from './pages/Promotions'
import PromoItem from './ui/Promotions/PromoItem'
import EditBooking from './ui/Bookings/EditBooking'
import Customers from './pages/Customers'
import CustomerItem from './ui/Customers/CustomerItem'
import IglooItem from './ui/Igloos/IglooItem'
import UserItem from './ui/Users/UserItem'
import EditUser from './ui/Users/EditUser'
import EditPromotion from './ui/Promotions/EditPromotion'
import EditCustomer from './ui/Customers/EditCustomer'
import BookingItem from './ui/Bookings/BookingItem'
import Forum from './pages/Forum'
import IgloosForm from './ui/Igloos/IgloosForm'

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
				path: '/bookings/:bookingId',
				element: <BookingItem />,
			},
			{
				path: '/igloos',
				element: <Igloos />,
			},
			{
				path: '/igloos/:iglooId',
				element: <IglooItem />,
			},
			{
				path: '/igloos/add',
				element: <IgloosForm />,
			},
			{
				path: '/igloos/:iglooId/edit',
				element: <IgloosForm />,
			},
			{
				path: '/users',
				element: <Users />,
			},
			{
				path: '/users/:userId',
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
				path: '/promotions/:promoId',
				element: <PromoItem />,
			},
			{
				path: '/promotions/:promoId/edit',
				element: <EditPromotion />,
			},
			{
				path: '/customers',
				element: <Customers />,
			},
			{
				path: '/customers/:customerId',
				element: <CustomerItem />,
			},
			{
				path: '/customers/:customerId/edit',
				element: <EditCustomer />,
			},
			{
				path: '/forum',
				element: <Forum />,
			},
		],
	},
])

function App() {
	return <RouterProvider router={router}></RouterProvider>
}

export default App
