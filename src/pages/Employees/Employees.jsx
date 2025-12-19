import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployees } from '../../slices/employeesSlice'
import { fetchEmployeeRoles } from '../../slices/employeeRoleSlice'
import SectionHeading from '../../components/SectionHeading'
import EmployeesTable from './EmployeesTable'
import Button from '../../components/Button'
import { useModal } from '../../contexts/modalContext'
import EmployeesForm from './EmployeesForm'

function Employees() {
	const dispatch = useDispatch()
	const employees = useSelector(state => state.employees.employees)
	const { openModal } = useModal()

	useEffect(() => {
		dispatch(fetchEmployees())
		dispatch(fetchEmployeeRoles())
        console.log(employees)
	}, [])

	if (!employees.length) return null

	const openAddEmployeeModal = () => {
		openModal(EmployeesForm)
	}

	return (
        <>
            {/* <Modal isOpen={isOpen}>{generateModalContent()}</Modal> */}
            <SectionHeading sectionTitle="Employees" />
            <div className="text-end">
                <Button onClick={openAddEmployeeModal}>Add employee</Button>
            </div>
            <EmployeesTable />
        </>
    )
}

export default Employees
