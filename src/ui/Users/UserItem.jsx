import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon, GoBackIcon } from '../Icons'
import SectionHeading from '../../components/SectionHeading'
import IglooItemCard from '../Igloos/IglooItemCard'

function UserItem() {
	const { userId } = useParams()
	const users = data.users
	const navigate = useNavigate()

	const user = users.find(user => user.id === +userId)

	return (
		<section className="item-section section mt-5">
			<span onClick={() => navigate(-1)} className="go-back">
				<GoBackIcon />
			</span>
			<p className="mt-4"></p>

			<SectionHeading sectionTitle="user"></SectionHeading>

			<div className="item-section__overview section-box section-margin flex-md-row user-item">
				<div className="user-img col-12 col-md-5 col-lg-4">
					<img src={`/${user.img}`} alt={user.name} />
				</div>

				<div className="item-section__info col-12 col-md-7">
					<h3 className="item-section__title">
						{user.name} {user.surname}
					</h3>
					<div className="item-section__user-role">
						<p className="user-role uppercase-text">role</p>
						<p className="role-title mt-2">{user.role}</p>
					</div>
					<div className="item-section__boxes flex-lg-row gap-lg-5 flex-wrap flex-xxl-nowrap">
						<IglooItemCard title="phone no" number={user.phoneNumber} />
						<IglooItemCard title="E-mail" number={`${user.email}`} />
						<IglooItemCard
							title="Address"
							number={`${user.address.street}`}
							additional={`${user.address.city} ${user.address.city}`}
							additional2={user.address.country}
						/>
					</div>
					<div className={`status status__${user.status} col-3 col-xxl-2 mt-4`}>{user.status}</div>

					<div className="item-section__actions mt-3">
						<span className="action-icon" onClick={() => navigate(`/users/${userId}/edit`)}>
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

export default UserItem
