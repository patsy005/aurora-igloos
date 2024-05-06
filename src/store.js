import { configureStore } from '@reduxjs/toolkit'
import IglooSlice from './slices/IglooSlice'
import bookingsSlice from './slices/bookings'
import usersSlice from './slices/usersSlice'

const store = configureStore({
	reducer: {
		igloos: IglooSlice,
		bookings: bookingsSlice,
		users: usersSlice,
	},
})

export default store
