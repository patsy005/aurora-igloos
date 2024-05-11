function SectionHeading({children, sectionTitle}) {
    return (
        <div className="heading section-margin">
        <h1>{sectionTitle}</h1>
        {children}
    </div>
    )
}

export default SectionHeading
