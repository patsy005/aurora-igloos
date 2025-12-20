import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Layout from './ui/Layout'
import Home from './pages/Home'
import Bookings from './pages/Bookings'
import Igloos from './pages/Igloos'
import Promotions from './pages/Promotions'
import PromoItem from './ui/Promotions/PromoItem'
import EditBooking from './ui/Bookings/EditBooking'
import IglooItem from './ui/Igloos/IglooItem'
import EditCustomer from './ui/Customers/EditCustomer'
import BookingItem from './ui/Bookings/BookingItem'
import Forum from './pages/Forum'
import IgloosForm from './ui/Igloos/IgloosForm'
import Employees from './pages/Employees/Employees'
import { ModalProvider } from './contexts/modalContext'
import EmployeesItem from './pages/Employees/EmployeesItem'
import Customers from './pages/Customers/Customers'
import CustomersItem from './pages/Customers/CustomersItem'

const router = createBrowserRouter([
	{
		element: (
			<ModalProvider>
				<Layout />
			</ModalProvider>
		),

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
				path: '/employees',
				element: <Employees />,
			},
			{
				path: '/employees/:employeeId',
				element: <EmployeesItem />,
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
				path: '/customers',
				element: <Customers />,
			},
			{
				path: '/customers/:customerId',
				element: <CustomersItem />,
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
