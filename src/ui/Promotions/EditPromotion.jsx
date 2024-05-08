import { useDispatch } from "react-redux"
import { setIsCreating, setIsEditing } from "../../slices/promoSlice"
import PromoForm from "./PromoForm"
import { useEffect } from "react"

function EditPromotion() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setIsCreating(false))
        dispatch(setIsEditing(true))
    
    })
    return (
        <div>
            <PromoForm />
        </div>
    )
}

export default EditPromotion
