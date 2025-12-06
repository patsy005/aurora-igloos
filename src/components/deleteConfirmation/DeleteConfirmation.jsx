import { useDispatch, useSelector } from 'react-redux'
import { closeModal, selectModalProps } from '../../slices/modalSlice'
import { deleteIgloo } from '../../slices/igloosSlice'
import toast from 'react-hot-toast'
import Button from '../Button'

function DeleteConfirmation({ itemToDelete }) {
	const dispath = useDispatch()
	const modalProps = useSelector(selectModalProps)

	const closeModalHandler = () => {
		dispath(closeModal())
	}

	const deleteItemHandler = () => {
        console.log('deleting item in category:', modalProps.category)
		switch (modalProps.category) {
			case 'igloo':
				dispath(deleteIgloo(itemToDelete.id))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Igloo deleted successfully'))
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
