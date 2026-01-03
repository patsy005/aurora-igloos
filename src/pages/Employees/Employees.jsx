import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployees } from '../../slices/employeesSlice'
import { fetchEmployeeRoles } from '../../slices/employeeRoleSlice'
import SectionHeading from '../../components/SectionHeading'
import EmployeesTable from './EmployeesTable'
import Button from '../../components/Button'
import { useModal } from '../../contexts/modalContext'
import EmployeesForm from './EmployeesForm'
import { selectCanManage } from '../../slices/authSlice'
import Spinner from '../../components/spinner/Spinner'

function Employees() {
	const dispatch = useDispatch()
	const employees = useSelector(state => state.employees.employees)
	const canManage = useSelector(selectCanManage)
	const token = useSelector(state => state.auth.accessToken)
	const isFetching = useSelector(state => state.employees.isFetching)
	const { openModal } = useModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchEmployees())
		dispatch(fetchEmployeeRoles())
		console.log(employees)
	}, [token])

	if (!employees.length) return null

	const openAddEmployeeModal = () => {
		openModal(EmployeesForm)
	}

	if (isFetching) return <Spinner className="page" />

	return (
		<>
			<SectionHeading sectionTitle="Employees" />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddEmployeeModal}>Add employee</Button>
				</div>
			)}
			<EmployeesTable />
		</>
	)
}

export default Employees
