import { useDispatch, useSelector } from 'react-redux'
import SectionHeading from '../SectionHeading'
import { setIsCreating } from '../../slices/IglooSlice'
import Button from '../Button'
import IgloosForm from './IgloosForm'
import IgloosTable from './IgloosTable'

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
			<IgloosTable />
			{/* <div className="box d-flex col-12 justify-content-between">
				<div className={`${!isIglooDetails ? 'w-100' : 'w-50'} overflow-x-scroll mt-5 table-container`}>
				</div>
				{isIglooDetails && (<div className="igloos__details w-50 mt-5 overview">


					</div>)}
			</div> */}
		</>
	)
}

export default IgloosView
