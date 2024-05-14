import { useNavigate, useParams } from 'react-router-dom'
import data from '../../../public/data.json'
import { DeleteIcon, EditIcon, GoBackIcon } from '../Icons'
import SectionHeading from '../../components/SectionHeading'
import IglooItemCard from '../Igloos/IglooItemCard'
import ReactSelect from 'react-select'
import UserTasksTable from './UserTasksTable'

function UserItem() {
	const { userId } = useParams()
	const users = data.users
	const navigate = useNavigate()

	const user = users.find(user => user.id === +userId)
	const schedlueWeeks = [
		{ value: '01.06.2024-07.06.2024', label: '01.06.2024-07.06.2024' },
		{ value: '08.06.2024-14.06.2024', label: '08.06.2024-14.06.2024' },
		{ value: '15.06.2024-21.06.2024', label: '15.06.2024-21.06.2024' },
	]

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
						<p className="user-role uppercase-text">email address</p>
						<p className="role-title mt-2">{user.email}</p>
					</div>
					<div className="item-section__boxes flex-lg-row gap-lg-5 flex-wrap flex-xxl-nowrap">
						<IglooItemCard title="phone no" number={user.phoneNumber} />
						<IglooItemCard title="Role" number={`${user.role}`} />
						<IglooItemCard
							title="Address"
							number={`${user.address.street}`}
							additional={`${user.address.city} ${user.address.city}`}
							additional2={user.address.country}
						/>
					</div>
					<div className={`status status__${user.status} col-5 col-sm-3 col-xxl-2 mt-4 user-status`}>{user.status}</div>

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

			<div className="item-section__overview section-box section-margin user-item working-schedlue">
				<h3>Working schedlue</h3>
				<div className="working-schedlue__top d-flex align-items-center justify-content-end">
					<p>Week</p>
					<ReactSelect
						closeMenuOnSelect={false}
						isMulti
						defaultValue="01.06.2024-07.06.2024"
						options={schedlueWeeks}
						classNamePrefix="react-select"
					/>
				</div>
				<div className="working-schedlue__box d-flex justify-content-between overflow-x-scroll gap-5">
					{Object.entries(user.schedule).map(([day, time], index) => (
						<div className="working-schedlue__day" key={index}>
							<p className="day">{day}</p>
							<p className="time">{time}</p>
						</div>
					))}
				</div>
			</div>

			<div className="">
				<div className="item-section__overview section-box section-margin user-item statistics col-12">
					<h3>Statistics</h3>
					<div className="item-section__boxes flex-lg-row gap-lg-5 flex-wrap">
						<IglooItemCard title="booking Completed" number={user.statistics.bookingsCompleted} />
						<IglooItemCard title="average Rating" number={user.statistics.averageRating} />
						<IglooItemCard title="total Revenue" number={`$ ${user.statistics.totalRevenue}`} />
					</div>
				</div>
				<div className="section-margin user-item tasks col-12">
					<h3>Tasks</h3>
					<UserTasksTable userId={userId} />
				</div>
			</div>
		</section>
	)
}

export default UserItem
