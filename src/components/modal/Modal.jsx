import ReactDOM from 'react-dom'
import { useModal } from "../../contexts/modalContext"

function Modal({ children, ...props}) {


    const {closeModal, isOpen, Component} = useModal()

    if(!isOpen || !Component) return null

    const onOverlayClick = () => closeModal()

    const onContentClick = (e) => e.stopPropagation()

    
    return ReactDOM.createPortal(
        <div className={`modal__overlay`} {...props} onClick={onOverlayClick}>
            <div className="modal__content" onClick={onContentClick}>{children}</div>
        </div>,
        document.body
    )
}

export default Modal
