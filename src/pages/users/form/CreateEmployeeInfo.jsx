import { useSelector } from 'react-redux'
import Button from '../../../components/Button'
import { useMemo } from 'react'
import { contentArrayToMap, getContentFromMap } from '../../../utils/utils'

function CreateEmployeeInfo({ openEmployeeForm }) {
	const content = useSelector(state => state.contentBlocks.items)

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	return (
		<div className="col-12 mt-4">
			<div className="alert alert-info">
				<p>
					<strong>
						{getContentFromMap(contentMap, 'users.form.createEmployee.title', 'Employee Account Creation')}
					</strong>
				</p>
				<p>
					{getContentFromMap(
						contentMap,
						'users.form.createEmployee.subtitle',
						'User for employee is created during employee creation. Use the form below:'
					)}
				</p>
				<Button type="button" onClick={openEmployeeForm} className="mt-2">
					{getContentFromMap(contentMap, 'users.form.createEmployee.btn', 'Create Employee User Account')}
				</Button>
			</div>
		</div>
	)
}

export default CreateEmployeeInfo
