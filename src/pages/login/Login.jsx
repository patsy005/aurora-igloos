import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../../slices/authSlice'
import FormBox from '../../components/Form/FormBox'
import Button from '../../components/Button'

function Login() {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {
		handleSubmit,
		register,
		reset,
		setError,
		clearErrors,
		formState: { errors, isLoading },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
	})

	const onSubmit = async data => {
		try {
			clearErrors('root')
			await dispatch(login(data)).unwrap()
			reset()
			navigate('/')
		} catch (err) {
			setError('root', { type: 'server', message: String(err) })
		}
	}

	const mainStyles = {
		height: '100vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<main className="main" style={mainStyles}>
			<div className="login d-flex align-items-center flex-column w-100">
				<img src="/images/logo.png" alt="" />

				<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
					{errors.root?.message && <p className="form-error mb-3">{errors.root.message}</p>}

					<FormBox label="Login" error={errors?.login?.message}>
						<input
							type="text"
							id="login"
							className={`input ${errors.login ? 'input-error' : ''}`}
							{...register('login', {
								required: 'Login can not be empty',
								minLength: {
									value: 3,
									message: 'Login must be at least 3 characters long',
								},
							})}
						/>
					</FormBox>

					<FormBox label="Password" error={errors?.password?.message}>
						<input
							type="password"
							id="password"
							className={`input ${errors.password ? 'input-error' : ''}`}
							{...register('password', {
								required: 'Password can not be empty',
								minLength: { value: 6, message: 'Password must have at least 6 characters' },
							})}
						/>
					</FormBox>

					<div className="d-flex justify-content-end text-end form-btns">
						<Button
							className="cancel-btn"
							onClick={() => {
								reset()
							}}
							type={'button'}>
							Cancel
						</Button>
						<Button type="submit">Login</Button>
					</div>
				</form>
			</div>
		</main>
	)
}

export default Login
