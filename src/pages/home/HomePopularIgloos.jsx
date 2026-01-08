import { useSelector } from 'react-redux'
import IgloosCarousel from '../../components/igloos-carousel/IgloosCarousel'
import { useMemo } from 'react'
import { contentArrayToMap, getContentFromMap } from '../../utils/utils'

function HomePopularIgloos() {
	const content = useSelector(state => state.contentBlocks.items)

	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	return (
		<section className="section section__popular-igloos section-margin">
			<div className="heading section-margin">
				<h2>{getContentFromMap(contentMap, 'home.popularIgloos.heading.title', 'Popular Igloos')}</h2>
				<p>{getContentFromMap(contentMap, 'home.popularIgloos.heading.subtitle', 'Top 5 most popular igloos')}</p>
			</div>
			<div className="popular-igloos">
				<IgloosCarousel />
			</div>
		</section>
	)
}

export default HomePopularIgloos
