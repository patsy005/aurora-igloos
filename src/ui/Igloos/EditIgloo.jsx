import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setIsCreating, setIsEditing } from "../../slices/IglooSlice"
import IgloosForm from "./IgloosForm"

function EditIgloo() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setIsCreating(false))
        dispatch(setIsEditing(true))
    
    })
    return (
        <div>
            <IgloosForm />
        </div>
    )
}

export default EditIgloo
