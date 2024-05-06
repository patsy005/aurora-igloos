import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setIsCreating, setIsEditing } from "../../slices/usersSlice"
import UsersForm from "./UsersForm"

function EditUser() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setIsCreating(false))
        dispatch(setIsEditing(true))
    
    })
    return (
        <div>
            <UsersForm />
        </div>
    )
}

export default EditUser
