import { createContext, useContext, useState } from 'react'
import Modal from '../components/modal/Modal'

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
	const [modalState, setModalState] = useState({
		isOpen: false,
		Component: null,
		props: {},
	})

	const openModal = (Component, props = {}) => {
		setModalState({
			isOpen: true,
			Component,
			props,
		})
	}

	const closeModal = () => {
		setModalState({
			isOpen: false,
			Component: null,
			props: {},
		})
	}

	const { isOpen, Component, props } = modalState

	return (
		<ModalContext.Provider value={{ isOpen, Component, props, openModal, closeModal }}>
			{children}

			{isOpen && Component && (
				<Modal>
					<Component {...props} onClose={closeModal} />
				</Modal>
			)}
		</ModalContext.Provider>
	)
}

export function useModal() {
	const context = useContext(ModalContext)
	if (!context) {
		throw new Error('useModal must be used within a ModalProvider')
	}
	return context
}
