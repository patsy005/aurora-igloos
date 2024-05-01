function FormBox({label, error, children}) {
    return (
        <div className="form__box col-12 col-sm-5">
            <label htmlFor={children.props.id} className="label">{label}</label>
            {children}
            {error && <p className="error-msg">{error}</p>}
        </div>
    )
}

export default FormBox
