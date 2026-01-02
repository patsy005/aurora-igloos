/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../../components/SectionHeading'
import { fetchIgloos } from '../../slices/igloosSlice'
import Button from '../../components/Button'
import IgloosForm from './IgloosForm'
import IgloosTable from './IgloosTable'
import { useEffect } from 'react'
import { fetchDiscounts } from '../../slices/discountsSlice'
import { useNavigate } from 'react-router-dom'
import { openModal, selectIsModalOpen, selectModalProps } from '../../slices/modalSlice'
import Modal from '../../components/modal/Modal'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { useModal } from '../../contexts/modalContext'
import { selectCanManage } from '../../slices/authSlice'
import Spinner from '../../components/spinner/Spinner'

function IgloosView() {
	const dispatch = useDispatch()
	const igloos = useSelector(state => state.igloos.igloos)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const isFetchingIgloos = useSelector(state => state.igloos.isFetchingIgloos)
	const { openModal } = useModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchIgloos())
		dispatch(fetchDiscounts())
	}, [dispatch, token])

	if (!igloos.length) return null

	const openAddIglooModal = () => {
		openModal(IgloosForm)
	}

	if (isFetchingIgloos) return <Spinner className="page" />
	
	return (
		<>
			<SectionHeading sectionTitle="igloos" />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddIglooModal}>Add igloo</Button>
				</div>
			)}
			<IgloosTable />
		</>
	)
}

export default IgloosView
