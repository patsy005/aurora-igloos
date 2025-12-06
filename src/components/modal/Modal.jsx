import { useLocation } from "react-router-dom"
import ReactDOM from 'react-dom'

function Modal({isOpen, children, ...props}) {
    const location = useLocation()

    const modalClassName = location.pathname.replace('/', '')

    if(!isOpen) return null
    return ReactDOM.createPortal(
        <div className={`modal__overlay modal__overlay--${modalClassName}`} {...props}>
            <div className="modal__content">{children}</div>
        </div>,
        document.body
    )
}

export default Modal
