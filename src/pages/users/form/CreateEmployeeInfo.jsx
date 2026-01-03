import Button from '../../../components/Button'

function CreateEmployeeInfo({ openEmployeeForm }) {
	return (
		<div className="col-12 mt-4">
			<div className="alert alert-info">
				<p>
					<strong>Employee Account Creation</strong>
				</p>
				<p>User for employee is created during employee creation. Use the form below:</p>
				<Button type="button" onClick={openEmployeeForm} className="mt-2">
					Create New Employee
				</Button>
			</div>
		</div>
	)
}

export default CreateEmployeeInfo