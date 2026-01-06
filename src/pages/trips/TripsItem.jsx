import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchTrips } from '../../slices/tripsSlice'
import { DeleteIcon, EditIcon, GoBackIcon } from '../../ui/Icons'
import { useModal } from '../../contexts/modalContext'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import TripsForm from './TripsForm'
import SectionHeading from '../../components/SectionHeading'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import ItemDetailsCard from '../../components/ItemDetailsCard'

function TripsItem() {
	const { tripId } = useParams()
	const trips = useSelector(state => state.trips.trips)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const isFething = useSelector(state => state.trips.isFetching)
	const token = useSelector(state => state.auth.accessToken)

	const { openModal } = useModal()

	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		if (!token) return
		dispatch(fetchTrips())
	}, [token])

	const trip = trips?.find(trip => trip.id === +tripId)

	useEffect(() => {
		if (!trip) return
	}, [trip])

	if (isFething) return <div>Loading...</div>
	if (!trip) return <div>Trip not found</div>

	return (
		<section className="item-section section mt-5">
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			<p className="mt-4"></p>

			<SectionHeading sectionTitle="Trip"></SectionHeading>

			<div className="item-section__overview section-box section-margin flex-md-row user-item">
				<div className="user-img col-12 col-md-5 col-lg-4">
					<img src={`http://localhost:5212/${trip.photoUrl}`} alt={trip.name} />
				</div>

				<div className="item-section__info col-12 col-md-7">
					<h3 className="item-section__title">{trip.name}</h3>
					<div className="item-section__user-role">
						<p className="user-role uppercase-text">Description</p>
						<p className="role-title mt-2">{trip.longDescription}</p>
					</div>
					<div className="item-section__boxes flex-lg-row gap-lg-5 flex-wrap flex-xxl-nowrap">
						<ItemDetailsCard title="price per person" number={`$${trip.pricePerPerson}`} />
						<ItemDetailsCard title="duration" number={`${trip.duration}`} />
						<ItemDetailsCard title="level of difficulty" number={`${trip.levelOfDifficultyName}`} />
						<ItemDetailsCard title="season" number={`${trip.seasonName}`} />
					</div>
					<div className={`status status__${trip.status} col-5 col-sm-3 col-xxl-2 mt-4 user-status`}>{trip.status}</div>

					<div className="item-section__actions mt-3">
						{canManage && (
							<span className="action-icon" onClick={() => openModal(TripsForm, { id: tripId })}>
								<EditIcon />
							</span>
						)}
						{canDelete && (
							<span
								className="action-icon"
								onClick={() => openModal(DeleteConfirmation, { id: tripId, category: 'trip', itemToDelete: trip })}>
								<DeleteIcon />
							</span>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}

export default TripsItem
