import { useNavigate, useParams } from 'react-router-dom'
import { DeleteIcon, EditIcon, GoBackIcon, ViewIcon } from '../../ui/Icons'
import IglooItemCard from '../../ui/Igloos/IglooItemCard'
import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../../components/SectionHeading'
import { useEffect } from 'react'
import { fetchCustomers } from '../../slices/customersSLice'
import { useModal } from '../../contexts/modalContext'
import CustomersForm from './CustomersForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'

function CustomersItem() {
	const { customerId } = useParams()

	const customers = useSelector(state => state.customers.customers)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const isFetchingCustomers = useSelector(state => state.customers.isFetching)
	const token = useSelector(state => state.auth.accessToken)

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { openModal } = useModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchCustomers())
	}, [token])

	const customer = customers.find(customer => customer.id === +customerId)

	console.log(customer)

	useEffect(() => {
		if (!customer) return
	}, [customer])

	return (
		<>
			{isFetchingCustomers || !customer ? (
				<p>Loading...</p>
			) : (
				<section className="item-section section mt-5">
					<span onClick={() => navigate(-1)} className="go-back">
						<GoBackIcon />
					</span>

					<SectionHeading sectionTitle="customer"></SectionHeading>

					<div className="item-section__overview section-box section-margin flex-md-row">
						<div className="item-section__info col-12">
							<h3 className="item-section__title">
								{customer.name} {customer.surname}
							</h3>

							<div className="item-section__user-role">
								<p className="user-role uppercase-text">email address</p>
								<p className="role-title mt-2">{customer.email}</p>
							</div>
							<div className="item-section__boxes flex-lg-row gap-lg-5 flex-wrap flex-xxl-nowrap">
								<IglooItemCard title="phone number" number={customer.phone} />
								<IglooItemCard
									title="Address"
									number={`${customer.street}`}
									additional={`${customer.city} ${customer.city}`}
									additional2={customer.country}
								/>

								<IglooItemCard title="Account created" number={customer.createUser ? 'Yes' : 'No'} />
							</div>

							{/* <div className="item-section__promo">
						<p className="promo uppercase-text">
							Booked igloo
							<div className="item-section__promo--igloos my-3 d-flex gap-5 flex-wrap">
								<div
									className="item-section__promo--igloo-box"
									key={bookedIgloo.id}
									onClick={() => navigate(`/igloos/${bookedIgloo.id}`)}>
									{bookedIgloo.name}
								</div>
								<span className="action-icon" onClick={() => navigate(`/igloos/${bookedIgloo.id}`)}>
									<ViewIcon />
								</span>
							</div>
						</p>
					</div> */}

							<div className="item-section__actions mt-3">
								{canManage && (
									<span className="action-icon" onClick={() => openModal(CustomersForm, { id: customerId })}>
										<EditIcon />
									</span>
								)}
								{canDelete && (
									<span
										className="action-icon"
										onClick={() =>
											openModal(DeleteConfirmation, { id: customerId, category: 'customer', itemToDelete: customer })
										}>
										<DeleteIcon />
									</span>
								)}
							</div>
						</div>
					</div>
				</section>
			)}
		</>
	)
}

export default CustomersItem
