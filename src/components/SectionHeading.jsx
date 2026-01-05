function SectionHeading({ children, sectionTitle, className = '' }) {
	return (
		<div className={`heading section-margin ${className}`}>
			<h1>{sectionTitle}</h1>
			{children}
		</div>
	)
}

export default SectionHeading
