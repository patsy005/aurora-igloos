import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useEffect, useMemo } from 'react'
import { fetchEmployees } from '../../slices/employeesSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { DeleteIcon, EditIcon, GoBackIcon } from '../../ui/Icons'
import SectionHeading from '../../components/SectionHeading'
import EmployeesForm from './EmployeesForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { selectCanDelete, selectCanManage } from '../../slices/authSlice'
import ItemDetailsCard from '../../components/ItemDetailsCard'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'
import Spinner from '../../components/spinner/Spinner'

function EmployeesItem() {
	const { employeeId } = useParams()
	const dispatch = useDispatch()
	const { openModal } = useModal()
	const employees = useSelector(state => state.employees.employees)
	const token = useSelector(state => state.auth.accessToken)
	const isFetchingEmployees = useSelector(state => state.employees.isFetching)
	const canManage = useSelector(selectCanManage)
	const canDelete = useSelector(selectCanDelete)
	const content = useSelector(state => state.contentBlocks.items)
	const contentMap = useMemo(() => contentArrayToMap(content), [content])
	const navigate = useNavigate()

	useEffect(() => {
		if (!token) return
		dispatch(fetchEmployees())
	}, [token])

	const employee = employees?.find(e => e.id === +employeeId)

	useEffect(() => {
		if (!employee) return
	}, [employee])

	return (
		<>
			{isFetchingEmployees || !employee ? (
				<Spinner className="page" />
			) : (
				<section className="item-section section mt-5">
					<span onClick={() => navigate(-1)} className="go-back">
						<GoBackIcon />
					</span>
					<p className="mt-4"></p>

					<SectionHeading
						sectionTitle={getContentFromMap(contentMap, 'employeeItem.heading', 'Employee')}></SectionHeading>

					<div className="item-section__overview section-box section-margin flex-md-row user-item">
						<div className="user-img col-12 col-md-5 col-lg-4">
							<img src={`http://localhost:5212/${employee.photoUrl}`} alt={employee.name} />
						</div>

						<div className="item-section__info col-12 col-md-7">
							<h3 className="item-section__title">
								{employee.name} {employee.surname}
							</h3>
							<div className="item-section__user-role">
								<p className="user-role uppercase-text">
									{getContentFromMap(contentMap, 'common.emailAddress', 'Email address')}
								</p>
								<p className="role-title mt-2">{employee.email}</p>
							</div>
							<div className="item-section__boxes flex-lg-row gap-lg-5 flex-wrap flex-xxl-nowrap">
								<ItemDetailsCard
									title={getContentFromMap(contentMap, 'common.phoneNo', 'Phone number')}
									number={employee.phoneNumber}
								/>
								<ItemDetailsCard
									title={getContentFromMap(contentMap, 'common.role', 'Role')}
									number={`${employee.role}`}
								/>
								<ItemDetailsCard
									title={getContentFromMap(contentMap, 'common.address', 'Address')}
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
				</section>
			)}
		</>
	)
}

export default EmployeesItem
