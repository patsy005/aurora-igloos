function PaginationBtn({onClick, disabled, children}) {
    return (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}

export default PaginationBtn
