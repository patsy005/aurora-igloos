import { configureStore } from '@reduxjs/toolkit'
import IglooSlice from './slices/igloosSlice'
import bookingsSlice from './slices/bookings'
import usersSlice from './slices/usersSlice'
import promoSlice from './slices/promoSlice'
import customersSLice from './slices/customersSLice'
import forumSlice from './slices/forum'
import discountsSlice from './slices/discountsSlice'
import modalSlice from './slices/modalSlice'

const store = configureStore({
	reducer: {
		igloos: IglooSlice,
		bookings: bookingsSlice,
		users: usersSlice,
		promo: promoSlice,
		customers: customersSLice,
		forum: forumSlice,
		discounts: discountsSlice,
		modal: modalSlice,
	},
})

export default store
