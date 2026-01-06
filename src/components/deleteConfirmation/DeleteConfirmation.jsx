import { useDispatch } from 'react-redux'
import { deleteIgloo } from '../../slices/igloosSlice'
import toast from 'react-hot-toast'
import Button from '../Button'
import { deleteDiscount } from '../../slices/discountsSlice'
import { deleteEmployee } from '../../slices/employeesSlice'
import { useModal } from '../../contexts/modalContext'
import { deleteCustomer, fetchCustomers } from '../../slices/customersSLice'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { deleteTrip } from '../../slices/tripsSlice'
import { deleteTripSeason } from '../../slices/tripSeasonSlice'
import { deleteTripLevel } from '../../slices/tripLevelSlice'
import { deleteBooking } from '../../slices/bookingsSlice'
import { deleteForumCategory } from '../../slices/forumCategorySlice'
import { deleteForumComment, fetchForumComments } from '../../slices/forumCommentSlice'
import { deleteUser, fetchUsers } from '../../slices/usersSlice'

function DeleteConfirmation({ itemToDelete, category }) {
	const { postId } = useParams()
	const dispath = useDispatch()
	const navigate = useNavigate()
	const { closeModal } = useModal()

	const closeModalHandler = () => {
		closeModal()
	}

	const deleteItemHandler = () => {
		switch (category) {
			case 'igloo':
				dispath(deleteIgloo(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Igloo deleted successfully'))
					.then(() => navigate('/igloos'))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
					})
				break
			case 'discount':
				dispath(deleteDiscount(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Discount deleted successfully'))
					.then(() => navigate('/discounts'))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
					})
				break
			case 'employee':
				dispath(deleteEmployee(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Employee deleted successfully'))
					.then(() => navigate('/employees'))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
					})
				break
			case 'customer':
				dispath(deleteCustomer(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Customer deleted successfully'))
					.then(() => navigate('/customers'))
					.then(() => dispath(fetchCustomers()))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
					})
				break
			case 'trip':
				dispath(deleteTrip(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Trip deleted successfully'))
					.then(() => navigate('/trips'))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
					})
				break
			case 'tripSeason':
				dispath(deleteTripSeason(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Trip seasons deleted successfully'))
					.then(() => navigate('/trip-seasons'))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
					})
				break
			case 'tripLevel':
				dispath(deleteTripLevel(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Trip level deleted successfully'))
					.then(() => navigate('/trip-levels'))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
					})
				break
			case 'booking':
				dispath(deleteBooking(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Booking deleted successfully'))
					.then(() => navigate('/bookings'))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
					})
				break
			case 'forum-category':
				dispath(deleteForumCategory(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Forum category deleted successfully'))
					.then(() => navigate('/forum-categories'))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
					})
				break
			case 'forum-comment':
				dispath(deleteForumComment(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Forum comment deleted successfully'))
					.then(() => navigate(`/forum-comments/${postId}`))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
						dispath(fetchForumComments())
					})
				break
			case 'user':
				dispath(deleteUser(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('User deleted successfully'))
					.then(() => navigate(`/users`))
					.catch(message => {
						toast.error(message)
						closeModalHandler()
						dispath(fetchUsers())
					})
				break
		}
	}
	return (
		<div className="box delete-confirmation">
			<div className="delete-confirmation__top">
				<h2 className="delete-confirmation__title">
					Delete <strong>{'category' in itemToDelete ? itemToDelete.category : itemToDelete.name}</strong>
				</h2>
				<button className="delete-confirmation__exit-button" onClick={closeModalHandler}>
					X
				</button>
			</div>
			<p className="delete-confirmation__text">
				Are you sure you want to delete{' '}
				<strong>{'category' in itemToDelete ? itemToDelete.category : itemToDelete.name}</strong>? This action cannot be
				reversed, and all the data inside it will be removed forever.
			</p>
			<div className="delete-confirmation__actions">
				<Button className="button__destroy" onClick={deleteItemHandler}>
					Yes, Confirm Deletion
				</Button>
				<Button className="tertiary" onClick={closeModalHandler}>
					No, Go Back
				</Button>
			</div>
		</div>
	)
}

export default DeleteConfirmation
