import { useModal } from '../../contexts/modalContext'
import Button from '../../components/Button'
import ReportModal from '../../components/report-modal/ReportModal'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function HomeHeading({ user }) {
	const content = useSelector(state => state.contentBlocks.items)
	const { openModal } = useModal()

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	return (
		<div className="home-heading section-margin">
			<h1>
				<span className="icon">{getContentFromMap(contentMap, 'home.heading.icon', '')}</span>
				<span className="title">{getContentFromMap(contentMap, 'home.heading', 'Dashboard')}</span>
			</h1>
			<div className="home-heading-content mt-3">
				<div className="welcome-section">
					<p className="welcome-text">{getContentFromMap(contentMap, 'home.welcome.text', 'Welcome back,')}</p>
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
