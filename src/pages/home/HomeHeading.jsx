import { useModal } from '../../contexts/modalContext'
import Button from '../../components/Button'
import ReportModal from '../../components/report-modal/ReportModal'

function HomeHeading({ user }) {
	const { openModal } = useModal()

	return (
		<div className="home-heading section-margin">
			<h1>
				<span className="icon">🏠</span>
				<span className="title">Dashboard</span>
			</h1>
			<div className="home-heading-content mt-3">
				<div className="welcome-section">
					<p className="welcome-text">Welcome back,</p>
					<p className="user-name">{user.name}!</p>
				</div>
				<Button type="button" onClick={() => openModal(ReportModal)} className="generate-report-btn">
					Generate report
				</Button>
			</div>
		</div>
	)
}

export default HomeHeading
