import { useForm } from 'react-hook-form'
import FormBox from '../Form/FormBox'
import Button from '../../components/Button'
import { useDispatch } from 'react-redux'
import { setIsCreating } from '../../slices/forum'

function ForumForm() {
    const dispatch = useDispatch()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const onSubmit = data => {
		console.log(data)
	}

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<FormBox label="Title" error={errors?.title?.message}>
				<input
					id="title"
					className={`input ${errors.title ? 'input-error' : ''}`}
					name="title"
					{...register('title', { required: 'Title can not be empty' })}
				/>
			</FormBox>
			<FormBox label="Description" error={errors?.description?.message}>
				<input
					id="description"
					className={`input ${errors.description ? 'input-error' : ''}`}
					name="description"
					{...register('description')}
				/>
			</FormBox>
			<FormBox label="Tags" error={errors?.tags?.message}>
				<input
					id="tags"
					className={`input ${errors.tags ? 'input-error' : ''}`}
					name="tags"
					placeholder="Separate tags with commas"
					{...register('tags', { required: 'Tags can not be empty' })}
				/>
			</FormBox>

            <div className="d-flex justify-content-end text-end form-btns">
				<Button
					className="cancel-btn"
					onClick={() => {
						dispatch(setIsCreating(false))
					}}>
					Cancel
				</Button>
				<Button>Add post</Button>
			</div>
		</form>
	)
}

export default ForumForm
