import { configureStore } from '@reduxjs/toolkit'
import IglooSlice from './slices/igloosSlice'
import bookingsSlice from './slices/bookingsSlice'
import usersSlice from './slices/usersSlice'
import promoSlice from './slices/promoSlice'
import customersSLice from './slices/customersSLice'
import forumSlice from './slices/forum'
import discountsSlice from './slices/discountsSlice'
import employeesSlice from './slices/employeesSlice'
import employeeRoleSlice from './slices/employeeRoleSlice'
import tripsSlice from './slices/tripsSlice'
import tripLevelSlice from './slices/tripLevelSlice'
import tripSeasonSlice from './slices/tripSeasonSlice'
import paymentMethodSlice from './slices/paymentMethodSlice'
import forumPostsSlice from './slices/forumPostsSlice'
import forumCategorySlice from './slices/forumCategorySlice'
import forumCommentSlice from './slices/forumCommentSlice'
import authSlice from './slices/authSlice'
import dashboardSlice from './slices/dashboardSlice'
import userTypesSlice from './slices/userTypesSlice'
import userRoleSlice from './slices/userRoleSlice'
import reportsSlice from './slices/reportsSlice'
import contentBlocksSlice from './slices/contentBlocksSlice'

const store = configureStore({
	reducer: {
		igloos: IglooSlice,
		bookings: bookingsSlice,
		promo: promoSlice,
		customers: customersSLice,
		forum: forumSlice,
		discounts: discountsSlice,
		employees: employeesSlice,
		employeeRoles: employeeRoleSlice,
		trips: tripsSlice,
		tripLevels: tripLevelSlice,
		tripSeasons: tripSeasonSlice,
		paymentMethods: paymentMethodSlice,
		forumPosts: forumPostsSlice,
		forumCategories: forumCategorySlice,
		forumComments: forumCommentSlice,
		auth: authSlice,
		dashboard: dashboardSlice,
		users: usersSlice,
		userTypes: userTypesSlice,
		userRoles: userRoleSlice,
		reports: reportsSlice,
		contentBlocks: contentBlocksSlice,
	},
})

export default store
