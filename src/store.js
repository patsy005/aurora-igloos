import { configureStore } from '@reduxjs/toolkit'
import IglooSlice from './slices/IglooSlice'
import bookingsSlice from './slices/bookings'

const store = configureStore({
	reducer: {
		igloos: IglooSlice,
		bookings: bookingsSlice,
	},
})

export default store
