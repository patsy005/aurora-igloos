import { configureStore } from '@reduxjs/toolkit'
import IglooSlice from './slices/IglooSlice'

const store = configureStore({
	reducer: {
		igloos: IglooSlice,
	},
})

export default store
