import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import './App.css'
import Layout from './ui/Layout'
import Home from './pages/Home'
// import Igloos from './pages/Igloos'
import Promotions from './pages/Promotions'
import PromoItem from './ui/Promotions/PromoItem'
// import IglooItem from './ui/Igloos/IglooItem'
// import IgloosForm from './ui/Igloos/IgloosForm'
import Employees from './pages/Employees/Employees'
import { ModalProvider } from './contexts/modalContext'
import EmployeesItem from './pages/Employees/EmployeesItem'
import Customers from './pages/Customers/Customers'
import CustomersItem from './pages/Customers/CustomersItem'
import Bookings from './pages/bookings/Bookings'
import Trips from './pages/trips/Trips'
import TripSeasons from './pages/tripSeasons/TripSeasons'
import TripsItem from './pages/trips/TripsItem'
import TripLevels from './pages/tripLevels/TripLevels'
import BookingsItem from './pages/bookings/BookingsItem'
import ForumPosts from './pages/forum/ForumPosts'
import ForumView from './ui/Forum/ForumView'
import ForumCommentsList from './pages/forum/forumComments/ForumCommentsList'
import Login from './pages/login/Login'
import ProtectedRoute from './pages/protectedRoute/ProtectedRoute'
import ForumCategories from './pages/forum/forumCategories/ForumCategories'
import Igloos from './pages/igloos/Igloos'
import IglooItem from './pages/igloos/IglooItem'
import IgloosForm from './pages/igloos/IgloosForm'

const router = createBrowserRouter([
	{
		element: (
			<ProtectedRoute>
				<ModalProvider>
					<Layout />
				</ModalProvider>
			</ProtectedRoute>
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
				path: '/bookings/:bookingId',
				element: <BookingsItem />,
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
				path: '/promotions/:discountId',
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
				element: <ForumPosts />,
			},
			// {
			// 	path: '/forum',
			// 	element: <ForumView />,
			// },
			{
				path: '/forum-comments/:postId',
				element: <ForumCommentsList />,
			},
			{
				path: '/trips',
				element: <Trips />,
			},
			{
				path: '/trips/:tripId',
				element: <TripsItem />,
			},
			{
				path: '/trip-seasons',
				element: <TripSeasons />,
			},
			{
				path: '/trip-levels',
				element: <TripLevels />,
			},
			{
				path: '/forum-categories',
				element: <ForumCategories />,
			},
		],
	},
	{
		path: '/login',
		element: <Login />,
	},
])

function App() {
	return <RouterProvider router={router}></RouterProvider>
}

export default App
