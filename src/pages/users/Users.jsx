import { useDispatch, useSelector } from 'react-redux'
import { selectIsAdmin } from '../../slices/authSlice'
import { useModal } from '../../contexts/modalContext'
import { useEffect } from 'react'
import { fetchUsers } from '../../slices/usersSlice'
import UsersForm from './UsersForm'
import Spinner from '../../components/spinner/Spinner'
import SectionHeading from '../../components/SectionHeading'
import UsersTable from './UsersTable'
import Button from '../../components/Button'

function Users() {
	const isAdmin = useSelector(selectIsAdmin)
	const users = useSelector(state => state.users.users)
	const token = useSelector(state => state.auth.accessToken)
	const isFetching = useSelector(state => state.users.isFetching)
	const { openModal } = useModal()
	const dispatch = useDispatch()

	useEffect(() => {
		if (!token) return

		dispatch(fetchUsers())
	}, [token])

	if (!users.length) return null

	if (!isAdmin) return null

	const openAddUserModal = () => {
		openModal(UsersForm)
	}

	if (isFetching) return <Spinner className="page" />

    console.log('users:', users)

	return <>
        <SectionHeading sectionTitle="Users" />
        <div className="text-end">
            <Button onClick={openAddUserModal} className="btn btn-primary">
                Add user
            </Button>
        </div>
        <UsersTable />
    </>
}

export default Users
