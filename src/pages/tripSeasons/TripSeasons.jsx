import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useEffect } from 'react'
import { fetchTripSeasons } from '../../slices/tripSeasonSlice'
import TripSeasonsForm from './TripSeasonsForm'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import TripSeasonsTable from './TripSeasonsTable'
import { GoBackIcon } from '../../ui/Icons'
import { useNavigate } from 'react-router-dom'
import { selectCanManage } from '../../slices/authSlice'

function TripSeasons() {
	const dispatch = useDispatch()
	const tripSeasons = useSelector(state => state.tripSeasons.tripSeasons)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const { openModal } = useModal()
	const navigate = useNavigate()

	useEffect(() => {
		if (!token) return
		dispatch(fetchTripSeasons())
	}, [token])

	if (!tripSeasons.length) return null

	const openAddTripSeasonModal = () => {
		openModal(TripSeasonsForm)
	}

	return (
		<>
			<SectionHeading sectionTitle="Trip Seasons" />
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			<p className="mt-4"></p>
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddTripSeasonModal}>Add trip season</Button>
				</div>
			)}
			<TripSeasonsTable />
		</>
	)
}

export default TripSeasons
