import { configureStore } from '@reduxjs/toolkit'
import IglooSlice from './slices/IglooSlice'
import bookingsSlice from './slices/bookings'
import usersSlice from './slices/usersSlice'
import promoSlice from './slices/promoSlice'
import customersSLice from './slices/customersSLice'

const store = configureStore({
	reducer: {
		igloos: IglooSlice,
		bookings: bookingsSlice,
		users: usersSlice,
		promo: promoSlice,
		customers: customersSLice,
	},
})

export default store
