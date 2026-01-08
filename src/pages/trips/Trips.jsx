import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useEffect, useMemo } from 'react'
import { fetchTrips } from '../../slices/tripsSlice'
import TripsForm from './TripsForm'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import TripsTable from './TripsTable'
import { useNavigate } from 'react-router-dom'
import { GoBackIcon } from '../../ui/Icons'
import { fetchTripSeasons } from '../../slices/tripSeasonSlice'
import { fetchTripLevel } from '../../slices/tripLevelSlice'
import { fetchEmployees } from '../../slices/employeesSlice'
import { selectCanManage } from '../../slices/authSlice'
import Spinner from '../../components/spinner/Spinner'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function Trips() {
	const dispatch = useDispatch()
	const trips = useSelector(state => state.trips.trips)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const isFetching = useSelector(state => state.trips.isFetching)
	const content = useSelector(state => state.contentBlocks.items)
	const { openModal } = useModal()
	const navigate = useNavigate()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	useEffect(() => {
		if (!token) return
		dispatch(fetchTrips())
		dispatch(fetchTripSeasons())
		dispatch(fetchTripLevel())
		dispatch(fetchEmployees())
	}, [token])

	if (!trips.length) return null

	const openAddTripModal = () => {
		openModal(TripsForm)
	}

	if (isFetching) return <Spinner className="page" />

	return (
		<>
			<SectionHeading sectionTitle={getContentFromMap(contentMap, '', 'Trips')} />
			<div>
				<span onClick={() => navigate('/trip-seasons')} className="text-link">
					{getContentFromMap(contentMap, '', 'Trip Seasons')}
					<span>
						<GoBackIcon />
					</span>
				</span>
			</div>
			<div>
				<span onClick={() => navigate('/trip-levels')} className="text-link">
					{getContentFromMap(contentMap, '', 'Trip Levels')}
					<span>
						<GoBackIcon />
					</span>
				</span>
			</div>
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddTripModal}>{getContentFromMap(contentMap, '', 'Add trip')}</Button>
				</div>
			)}
			<TripsTable />
		</>
	)
}

export default Trips
