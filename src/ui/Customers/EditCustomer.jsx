import { useDispatch } from "react-redux"
import { setIsCreating, setIsEditing } from "../../slices/customersSLice"
import CustomersForm from "./CustomersForm"
import { useEffect } from "react"

function EditCustomer() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setIsCreating(false))
        dispatch(setIsEditing(true))
    })
    return (
        <div>
            <CustomersForm />
        </div>
    )
}

export default EditCustomer
