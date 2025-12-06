import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isOpen: false,
    modalProps: {},
    category: '',
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true
            state.modalProps = action.payload || {}
        },
        closeModal: (state) => {
            state.isOpen = false
            state.modalProps = {}
        },
    }
})

export const selectIsModalOpen = (state) => state.modal.isOpen
export const selectModalProps = (state) => state.modal.modalProps

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer