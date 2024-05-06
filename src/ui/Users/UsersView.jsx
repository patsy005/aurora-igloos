import { useDispatch, useSelector } from "react-redux"
import { setIsCreating } from "../../slices/usersSlice"
import SectionHeading from "../SectionHeading"
import Button from "../Button"
import UsersForm from "./UsersForm"
import UsersTable from "./UsersTable"


function UsersView() {
	const isCreating = useSelector(state => state.users.isCreating)
	const isEditing = useSelector(state => state.users.isEditing)
    const dispatch = useDispatch()

    const handleAddIgloo = () => {
		dispatch(setIsCreating(true))
	}

	return (
		<>
			<SectionHeading sectionTitle="users" />
            <div className="text-end">{!isCreating && <Button onClick={handleAddIgloo}>Add user</Button>}</div>
			{isCreating && <UsersForm setIsCreating={setIsCreating} />}
            <UsersTable />
		</>
	)
}

export default UsersView
