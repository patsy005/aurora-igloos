import moment from 'moment'
import data from '../../../public/data.json'
import { StarIcon } from '../Icons'

const customers = data.customers

function IglooReviewsItem({review}) {
    const customer = customers.find(customer => customer.id === review.customerId)
      
    return (
		<div className="forum__item d-md-flex gap-5">
			{/* <div className="forum__item--left d-none d-md-block">
				<img src={user.img} alt="User image" />
			</div> */}
			<div className="forum__item--right d-flex flex-column gap-3 gap-md-4 gap-lg-5">
				<div
					className="forum__item--top d-flex flex-column gap-2 flex-lg-row
                justify-content-lg-between align-items-lg-center">
					<p className="title">{customer.name} {customer.surname}</p>
					<p className="date">{moment().format('MMM Do YY')}</p>
				</div>

				{/* {<p className="description">{customer.email}</p>} */}

    

				<div className="forum__item--bottom d-flex flex-column flex-lg-row justify-content-lg-between gap-3 gap-md-4 gap-lg-5">
					<div className="">
                        <p className="review-comment">{review.comment}</p>
					</div>
					<div className="comments d-flex align-items-center justify-content-lg-end w-50">
						<span className="">
                            <StarIcon />
						</span>
						<span className="commentCount">{review.rating}</span>
					</div>
				</div>
			</div>
		</div>
    )
}

export default IglooReviewsItem
