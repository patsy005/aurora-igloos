import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../SectionHeading'
import { setIsCreating } from '../../slices/IglooSlice'
import Button from '../Button'
import IgloosForm from './IgloosForm'

function IgloosView() {
	const isCreating = useSelector(state => state.igloos.isCreating)
	const isEditing = useSelector(state => state.igloos.isEditing)
    const dispatch = useDispatch()

    const handleAddIgloo = () => {
		dispatch(setIsCreating(true))
	}

	return (
		<>
			<SectionHeading sectionTitle="igloos" />
            <div className="text-end">{!isCreating && <Button onClick={handleAddIgloo}>Add igloo</Button>}</div>
			{isCreating && <IgloosForm setIsCreating={setIsCreating} />}
		</>
	)
}

export default IgloosView
