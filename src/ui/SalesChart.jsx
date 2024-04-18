import BookingChart from "./BookingChart"

function SalesChart() {
    return (
        <section className="section section-stats section-margin">
        <div className="heading section-margin">
            <h2>Sales from last 2 years</h2>
        </div>
        <div className="section-box section-stats__box">
            <div className="col-12" style={{ width: '100%', height: '30rem' }}>
                <BookingChart />
            </div>
        </div>
    </section>
    )
}

export default SalesChart
