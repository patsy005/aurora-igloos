import 'react-multi-carousel/lib/styles.css'
import { useSelector } from 'react-redux'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'

function IgloosCarousel() {
	const igloos = useSelector(state => state.igloos.igloos)

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		adaptiveHeight: true,
		centerMode: true,
		initialSlide: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					centerMode: true,
					slidesToShow: 2,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
					initialSlide: 1,
				},
			},
			{
				breakpoint: 550,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
					adaptiveHeight: true,
					initialSlide: 1,
					centerMode: true,
				},
			},
		],
	}
	return (
		<>
			<Slider {...settings}>
				{igloos.map(igloo => {
					return (
						<>
							<div className="igloo" key={igloo.id} id={igloo.id}>
								<div className="igloo-img">
									<img src={igloo.imagePath} alt="" />
								</div>
								<div className="igloo-info">
									<div className={`booking-status booking-status--${igloo.status}`}>
										<p>{igloo.status}</p>
									</div>
									<p>
										{igloo.name} G<span>{igloo.capacity}</span>
									</p>
								</div>
							</div>
						</>
					)
				})}
			</Slider>
			{/* <Carousel
				responsive={responsive}
				ssr={true}
				showDots={true}
				swipeable={true}
				draggable={false}
				infinite={true}
				// autoPlay={true}
				// autoPlaySpeed={3000}
				keyboardControl={true}
				customTransition="all .5"
				removeArrowOnDeviceType={['mobile']}
				containerClass="carousel-container"
				dotListClass="custom-dot-list-style"
				deviceType={deviceType}
				itemClass="carousel-item-padding-40-px">
				{igloos.map(igloo => {
					return (
						<>
							<div className="igloo" key={igloo.id} id={igloo.id}>
								<div className="igloo-img">
									<img src={igloo.imagePath} alt="" />
								</div>
								<div className="igloo-info">
									<div className="booking-status booking-status--available">
										<p>{igloo.status}</p>
									</div>
									<p>
										{igloo.name} G<span>{igloo.capacity}</span>
									</p>
								</div>
							</div>
						</>
					)
				})}
			</Carousel> */}
		</>
	)
}

export default IgloosCarousel
