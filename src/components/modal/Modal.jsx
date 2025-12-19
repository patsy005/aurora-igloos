import { useLocation } from "react-router-dom"
import ReactDOM from 'react-dom'
import { useModal } from "../../contexts/modalContext"

function Modal({ children, ...props}) {
    // const location = useLocation()

    // const modalClassName = location.pathname.replace('/', '')

    // if(!isOpen) return null

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
