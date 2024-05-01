function Button({ children, onClick, disabled, type, className }) {
	return (
		<button type={type} className={`button ${className}`} onClick={onClick} disabled={disabled}>
			{children}
		</button>
	)
}

export default Button
