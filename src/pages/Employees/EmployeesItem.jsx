import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useEffect } from 'react'
import { fetchEmployees } from '../../slices/employeesSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { DeleteIcon, EditIcon, GoBackIcon } from '../../ui/Icons'
import SectionHeading from '../../components/SectionHeading'
import IglooItemCard from '../../ui/Igloos/IglooItemCard'
import EmployeesForm from './EmployeesForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'

function EmployeesItem() {
	const { employeeId } = useParams()
	const dispatch = useDispatch()
	const { openModal } = useModal()
	const employees = useSelector(state => state.employees.employees)
	const token = useSelector(state => state.auth.accessToken)
	const isFetchingEmployees = useSelector(state => state.employees.isFetching)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const navigate = useNavigate()

	useEffect(() => {
		if (!token) return
		dispatch(fetchEmployees())
	}, [token])

	const employee = employees?.find(e => e.id === +employeeId)

	useEffect(() => {
		if (!employee) return
	}, [employee])

	console.log('employee:', employee)
	console.log('employee id:', employeeId)

	return (
		<>
			{isFetchingEmployees || !employee ? (
				<p>Loading...</p>
			) : (
				<section className="item-section section mt-5">
					<span onClick={() => navigate(-1)} className="go-back">
						<GoBackIcon />
					</span>
					<p className="mt-4"></p>

					<SectionHeading sectionTitle="user"></SectionHeading>

					<div className="item-section__overview section-box section-margin flex-md-row user-item">
						<div className="user-img col-12 col-md-5 col-lg-4">
							<img src={`http://localhost:5212/${employee.photoUrl}`} alt={employee.name} />
						</div>

						<div className="item-section__info col-12 col-md-7">
							<h3 className="item-section__title">
								{employee.name} {employee.surname}
							</h3>
							<div className="item-section__user-role">
								<p className="user-role uppercase-text">email address</p>
								<p className="role-title mt-2">{employee.email}</p>
							</div>
							<div className="item-section__boxes flex-lg-row gap-lg-5 flex-wrap flex-xxl-nowrap">
								<IglooItemCard title="phone no" number={employee.phoneNumber} />
								<IglooItemCard title="Role" number={`${employee.role}`} />
								<IglooItemCard
									title="Address"
									number={`${employee.street}`}
									additional={`${employee.city} ${employee.city}`}
									additional2={employee.country}
								/>
							</div>
							<div className={`status status__${employee.status} col-5 col-sm-3 col-xxl-2 mt-4 user-status`}>
								{employee.status}
							</div>

							<div className="item-section__actions mt-3">
								{canManage && (
									<span className="action-icon" onClick={() => openModal(EmployeesForm, { id: employeeId })}>
										<EditIcon />
									</span>
								)}
								{canDelete && (
									<span
										className="action-icon"
										onClick={() =>
											openModal(DeleteConfirmation, { id: employeeId, category: 'employee', itemToDelete: employee })
										}>
										<DeleteIcon />
									</span>
								)}
							</div>
						</div>
					</div>

					{/* <div className="item-section__overview section-box section-margin user-item working-schedlue">
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
					{Object.entries(employee.schedule).map(([day, time], index) => (
						<div className="working-schedlue__day" key={index}>
							<p className="day">{day}</p>
							<p className="time">{time}</p>
						</div>
					))}
				</div>
			</div> */}

					{/* <div className="">
				<div className="item-section__overview section-box section-margin user-item statistics col-12">
					<h3>Statistics</h3>
					<div className="item-section__boxes flex-lg-row gap-lg-5 flex-wrap">
						<IglooItemCard title="booking Completed" number={employee.statistics.bookingsCompleted} />
						<IglooItemCard title="average Rating" number={employee.statistics.averageRating} />
						<IglooItemCard title="total Revenue" number={`$ ${employee.statistics.totalRevenue}`} />
					</div>
				</div>
				<div className="section-margin user-item tasks col-12">
					<h3>Tasks</h3>
					<UserTasksTable userId={userId} />
				</div>
			</div> */}
				</section>
			)}
		</>
	)
}

export default EmployeesItem
