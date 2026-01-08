import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { fetchTripLevel } from '../../slices/tripLevelSlice'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'
import TripLevelsForm from './TripLevelsForm'
import SectionHeading from '../../components/SectionHeading'
import { GoBackIcon } from '../../ui/Icons'
import Button from '../../components/Button'
import TripLevelsTable from './TripLevelsTable'
import { selectCanManage } from '../../slices/authSlice'
import Spinner from '../../components/spinner/Spinner'

function TripLevels() {
	const dispatch = useDispatch()
	const tripLevels = useSelector(state => state.tripLevels.tripLevels)
	const canManage = useSelector(selectCanManage)
	const token = useSelector(state => state.auth.accessToken)
	const isFetching = useSelector(state => state.tripLevels.isFetching)
	const content = useSelector(state => state.contentBlocks.items)
	const contentMap = useMemo(() => contentArrayToMap(content), [content])
	const { openModal } = useModal()
	const navigate = useNavigate()

	useEffect(() => {
		if (!token) return
		dispatch(fetchTripLevel())
	}, [token])

	if (!tripLevels.length) return null

	const openTripLevelModal = () => {
		openModal(TripLevelsForm)
	}

	if(isFetching) return <Spinner className="page" />

	return (
		<>
			<SectionHeading sectionTitle={getContentFromMap(contentMap, 'tripLevels.heading', 'Trip Levels')} />
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			{canManage && (
				<div className="text-end">
					<Button onClick={openTripLevelModal}>{getContentFromMap(contentMap, 'tripLevels.cta', 'Add trip level')}</Button>
				</div>
			)}
			<TripLevelsTable />
		</>
	)
}

export default TripLevels
