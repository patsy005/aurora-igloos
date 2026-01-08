import { useDispatch, useSelector } from 'react-redux'
import { selectIsAdmin } from '../../slices/authSlice'
import { useModal } from '../../contexts/modalContext'
import { useEffect, useMemo } from 'react'
import { fetchUsers } from '../../slices/usersSlice'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'
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
	const content = useSelector(state => state.contentBlocks.items)
	const { openModal } = useModal()
	const dispatch = useDispatch()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

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

	return <>
        <SectionHeading sectionTitle={getContentFromMap(contentMap, 'users.heading', 'Users')} />
        <div className="text-end">
            <Button onClick={openAddUserModal} className="btn btn-primary">
                {getContentFromMap(contentMap, 'users.cta', 'Add user')}
            </Button>
        </div>
        <UsersTable />
    </>
}

export default Users
