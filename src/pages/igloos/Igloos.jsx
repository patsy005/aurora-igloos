import { useDispatch, useSelector } from 'react-redux'
import { selectCanManage } from '../../slices/authSlice'
import { useModal } from '../../contexts/modalContext'
import { useEffect } from 'react'
import { fetchIgloos } from '../../slices/igloosSlice'
import { fetchDiscounts } from '../../slices/discountsSlice'
import IgloosForm from './IgloosForm'
import Spinner from '../../components/spinner/Spinner'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import IgloosTable from './IgloosTable'

function Igloos() {
	const dispatch = useDispatch()
	const igloos = useSelector(state => state.igloos.igloos)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const isFetchingIgloos = useSelector(state => state.igloos.isFetching)
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
			<SectionHeading sectionTitle="Igloos" />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddIglooModal}>Add igloo</Button>
				</div>
			)}
			<IgloosTable />
		</>
	)
}

export default Igloos
