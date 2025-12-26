import { configureStore } from '@reduxjs/toolkit'
import IglooSlice from './slices/igloosSlice'
import bookingsSlice from './slices/bookingsSlice'
import usersSlice from './slices/usersSlice'
import promoSlice from './slices/promoSlice'
import customersSLice from './slices/customersSLice'
import forumSlice from './slices/forum'
import discountsSlice from './slices/discountsSlice'
import modalSlice from './slices/modalSlice'
import employeesSlice from './slices/employeesSlice'
import employeeRoleSlice from './slices/employeeRoleSlice'
import tripsSlice from './slices/tripsSlice'
import tripLevelSlice from './slices/tripLevelSlice'
import tripSeasonSlice from './slices/tripSeasonSlice'
import paymentMethodSlice from './slices/paymentMethodSlice'
import forumPostsSlice from './slices/forumPostsSlice'

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
		employees: employeesSlice,
		employeeRoles: employeeRoleSlice,
		trips: tripsSlice,
		tripLevels: tripLevelSlice,
		tripSeasons: tripSeasonSlice,
		paymentMethods: paymentMethodSlice,
		forumPosts: forumPostsSlice,
	},
})

export default store
