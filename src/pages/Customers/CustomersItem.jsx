import { useNavigate, useParams } from 'react-router-dom'
import { DeleteIcon, EditIcon, GoBackIcon } from '../../ui/Icons'
import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../../components/SectionHeading'
import { useEffect, useMemo } from 'react'
import { fetchCustomers } from '../../slices/customersSLice'
import { useModal } from '../../contexts/modalContext'
import CustomersForm from './CustomersForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import ItemDetailsCard from '../../components/ItemDetailsCard'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function CustomersItem() {
	const { customerId } = useParams()

	const customers = useSelector(state => state.customers.customers)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const isFetchingCustomers = useSelector(state => state.customers.isFetching)
	const token = useSelector(state => state.auth.accessToken)
	const content = useSelector(state => state.contentBlocks.items)

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	useEffect(() => {
		if (!token) return
		dispatch(fetchCustomers())
	}, [token])

	const customer = customers.find(customer => customer.id === +customerId)

	useEffect(() => {
		if (!customer) return
	}, [customer])

	return (
		<>
			{isFetchingCustomers || !customer ? (
				<p>Loading...</p>
			) : (
				<section className="item-section section mt-5">
					<span onClick={() => navigate(-1)} className="go-back mb-4">
						<GoBackIcon />
					</span>

					<SectionHeading
						sectionTitle={getContentFromMap(contentMap, 'customersItem.heading', 'Customer')}></SectionHeading>

					<div className="item-section__overview section-box section-margin flex-md-row">
						<div className="item-section__info col-12">
							<h3 className="item-section__title">
								{customer.name} {customer.surname}
							</h3>

							<div className="item-section__user-role">
								<p className="user-role uppercase-text">
									{getContentFromMap(contentMap, 'common.emailAddress', 'Email Address')}
								</p>
								<p className="role-title mt-2">{customer.email}</p>
							</div>
							<div className="item-section__boxes flex-lg-row gap-lg-5 flex-wrap flex-xxl-nowrap">
								<ItemDetailsCard
									title={getContentFromMap(contentMap, 'common.phoneNo', 'Phone Number')}
									number={customer.phone}
								/>
								<ItemDetailsCard
									title={getContentFromMap(contentMap, 'common.address', 'Address')}
									number={`${customer.street}`}
									additional={`${customer.city} ${customer.city}`}
									additional2={customer.country}
								/>

								<ItemDetailsCard
									title={getContentFromMap(contentMap, 'customersItem.accountCreated', 'Account Created')}
									number={customer.createUser ? 'Yes' : 'No'}
								/>
							</div>

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
