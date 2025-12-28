import { useDispatch } from 'react-redux'
import { LogoutIcon } from '../ui/Icons'
import { logout } from '../slices/authSlice'
import { useNavigate } from 'react-router-dom'

function Header({ user }) {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const onLogout = () => {
		dispatch(logout())
		navigate('/login')
	}

	return (
		<header className="header">
			<div className="user">
				<div className="user-img">
					<img src={`http://localhost:5212/${user.photoUrl}`} alt="user image" />
					<div className="user-status user-status--active"></div>
				</div>
				<div className="user-data">
					<h4 className="user-name">
						<span>
							{user.name} {user.surname}
						</span>
					</h4>
					<p className="user-mail">{user.email}</p>
				</div>
			</div>
			<div className="action-btns d-flex">
				<button className="btn" onClick={onLogout}>
					<LogoutIcon />
				</button>
			</div>
		</header>
	)
}

export default Header
