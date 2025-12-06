/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../../components/SectionHeading'
import { fetchIgloos, setIsCreating } from '../../slices/igloosSlice'
import Button from '../../components/Button'
import IgloosForm from './IgloosForm'
import IgloosTable from './IgloosTable'
import { useEffect } from 'react'
import { fetchDiscounts } from '../../slices/discountsSlice'
import { useNavigate } from 'react-router-dom'
import { openModal, selectIsModalOpen, selectModalProps } from '../../slices/modalSlice'
import Modal from '../../components/modal/Modal'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'

function IgloosView() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const igloos = useSelector(state => state.igloos.igloos)
	const modalProps = useSelector(selectModalProps)
	const isOpen = useSelector(selectIsModalOpen)

	useEffect(() => {
		dispatch(fetchIgloos())
		dispatch(fetchDiscounts())
	}, [dispatch])

	if (!igloos.length) return null

	// const handleAddIgloo = () => {
	// 	// dispatch(setIsCreating(true))
	// 	navigate(`/igloos/add`)
	// }

	const openAddIglooModal = () => {
		dispatch(openModal({ type: 'addIgloo', category: 'igloo' }))
	}

	const generateModalContent = () => {
		if (modalProps) {
			console.log('adding modal content for type:', modalProps.type)
			if (modalProps.type === 'addIgloo' || modalProps.type === 'editIgloo') {
				return <IgloosForm />
			}

			if (modalProps.type === 'deleteIgloo') {
				const itemToDelete = igloos.find(i => i.id === +modalProps?.id)
				console.log(itemToDelete)
				return itemToDelete ? <DeleteConfirmation itemToDelete={itemToDelete} /> : null
			}
		}
	}
	return (
		<>
			<Modal isOpen={isOpen}>{generateModalContent()}</Modal>
			<SectionHeading sectionTitle="igloos" />
			<div className="text-end">
				<Button onClick={openAddIglooModal}>Add igloo</Button>
			</div>
			<IgloosTable />
		</>
	)
}

export default IgloosView
