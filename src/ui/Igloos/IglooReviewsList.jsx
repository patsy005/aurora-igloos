
import IglooReviewsItem from './IglooReviewsItem'

function IglooReviewsList({ igloo }) {
	return (
		<div className="col-12 mt-5 forum__list d-flex flex-column">
			{igloo.reviews.map((review, index) => {
				return <IglooReviewsItem review={review} key={index} />
			})}
		</div>
	)
}

export default IglooReviewsList
