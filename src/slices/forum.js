import {  createSlice } from '@reduxjs/toolkit'

const initialState = {
	forumPosts: [],
	error: '',
	status: 'idle',
	isFetching: false,
    isCreating: false,
    isEditing: false,
}

const forumSlice = createSlice({
	name: 'forum',
	initialState,
	reducers: {
        setIsCreating: (state, action) => {
            state.isCreating = action.payload
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload
        },
    }
})

export const {setIsCreating, setIsEditing} = forumSlice.actions
export default forumSlice.reducer
