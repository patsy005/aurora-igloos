import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon, GoBackIcon, ViewIcon } from '../Icons'
import SectionHeading from '../../components/SectionHeading'
import IglooItemCard from '../Igloos/IglooItemCard'

function CustomerItem() {
	const { customerId } = useParams()
	const customers = data.customers
	const igloos = data.igloos
	const bookings = data.bookings
	const customer = customers.find(customer => customer.id === +customerId)
	const booking = bookings.find(booking => booking.customerId === +customerId)
	const bookedIgloo = igloos.find(igloo => igloo.id === booking.iglooId)
	const navigate = useNavigate()

	return (
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
						<IglooItemCard title="phone number" number={customer.phoneNumber} />
						<IglooItemCard title="nationality" number="nationality" />
					</div>

					<div className="item-section__promo">
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
					</div>

					<div className="item-section__actions mt-3">
						<span className="action-icon" onClick={() => navigate(`/customers/${customerId}/edit`)}>
							<EditIcon />
						</span>
						<span className="action-icon">
							<DeleteIcon />
						</span>
					</div>
				</div>
			</div>
		</section>
	)
}

export default CustomerItem
