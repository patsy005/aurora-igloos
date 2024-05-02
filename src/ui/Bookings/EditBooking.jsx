import { useDispatch } from "react-redux"
import BookingsForm from "./BookingsForm"
import { useEffect } from "react"
import { setIsCreating, setIsEditing } from "../../slices/bookings"

function EditBooking() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setIsCreating(false))
        dispatch(setIsEditing(true))
    })
    return (
        <div>
            <BookingsForm />
        </div>
    )
}

export default EditBooking
