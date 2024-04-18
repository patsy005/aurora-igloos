import { LogoutIcon, MsgIcon, NotificationIcon } from './Icons'

function Header({ user }) {
	return (
		<header className="header">
			<div className="user">
				<div className="user-img">
					<img src="/images/user.jpg" alt="user image" />
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
			{/* <div className="action-btns-dropdown d-md-none">
            <div className="actions-status actions-status--notification"></div>
            <ArrowDownIcon />
        </div> */}
			<div className="action-btns d-flex">
				<button className="btn">
					<MsgIcon />
					<div className="actions-status actions-status--notification"></div>
				</button>
				<button className="btn">
					<NotificationIcon />
				</button>
				<button className="btn">
					<LogoutIcon />
				</button>
			</div>
		</header>
	)
}

export default Header
