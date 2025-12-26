import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchTripLevel } from '../../slices/tripLevelSlice'
import TripLevelsForm from './TripLevelsForm'
import SectionHeading from '../../components/SectionHeading'
import { GoBackIcon } from '../../ui/Icons'
import Button from '../../components/Button'
import TripLevelsTable from './TripLevelsTable'

function TripLevels() {
	const dispatch = useDispatch()
	const tripLevels = useSelector(state => state.tripLevels.tripLevels)
	const { openModal } = useModal()
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(fetchTripLevel())
	}, [])

	if (!tripLevels.length) return null

	const openTripLevelModal = () => {
		openModal(TripLevelsForm)
	}

	return (
		<>
			<SectionHeading sectionTitle="Trip Levels" />
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			<div className="text-end">
				<Button onClick={openTripLevelModal}>Add trip level</Button>
			</div>
			<TripLevelsTable />
		</>
	)
}

export default TripLevels
