import IgloosCarousel from '../../components/igloos-carousel/IgloosCarousel'

function HomePopularIgloos() {
	return (
		<section className="section section__popular-igloos section-margin">
			<div className="heading section-margin">
				<h2>Popular Igloos</h2>
				<p>Top 5 most popular igloos</p>
			</div>
			<div className="popular-igloos">
				<IgloosCarousel />
			</div>
		</section>
	)
}

export default HomePopularIgloos
