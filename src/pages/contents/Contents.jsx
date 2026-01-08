import { useDispatch, useSelector } from "react-redux"
import { selectCanManage } from "../../slices/authSlice"
import { useModal } from "../../contexts/modalContext"
import { useEffect, useMemo } from "react"
import { fetchContentBlocks } from "../../slices/contentBlocksSlice"
import { contentArrayToMap, getContentFromMap } from "../../utils/utils"
import ContentsForm from "./ContentsForm"
import Spinner from "../../components/spinner/Spinner"
import SectionHeading from "../../components/SectionHeading"
import Button from "../../components/Button"
import ContentsTable from "./ContentsTable"

function Contents() {
	const dispatch = useDispatch()
	const contents = useSelector(state => state.contentBlocks.items)
	const token = useSelector(state => state.auth.accessToken)
	const canManage = useSelector(selectCanManage)
	const isFetching = useSelector(state => state.contentBlocks.isLoading)
	const content = useSelector(state => state.contentBlocks.items)
	const contentMap = useMemo(() => contentArrayToMap(content), [content])

	const { openModal } = useModal()

	useEffect(() => {
		if (!token) return
		dispatch(fetchContentBlocks())
	}, [token])

	// if (!contents.length) return null

	const openAddContentModal = () => {
		openModal(ContentsForm)
	}

	if (isFetching) return <Spinner className="page" />

	return (
		<>
			<SectionHeading sectionTitle={getContentFromMap(contentMap, 'contents.heading', 'Contents')} />
			{canManage && (
				<div className="text-end">
					<Button onClick={openAddContentModal}>{getContentFromMap(contentMap, 'content.cta', 'Add content')}</Button>
				</div>
			)}
			<ContentsTable />
		</>
	)
}

export default Contents
