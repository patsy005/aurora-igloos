import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { Controller, useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import Button from '../../components/Button'
import Spinner from '../../components/spinner/Spinner'
import SelectComponent from '../../components/select/SelectComponent'

import ReactDatePicker from 'react-datepicker'
import { DatePickerIcon } from '../../ui/Icons'

import { formatDateOnly } from '../../utils/utils'
import { clearReportsState, generateReport } from '../../slices/reportsSlice'
import './ReportModal.scss'

function getDefaultFromDate() {
	const d = new Date()
	d.setDate(d.getDate() - 29)
	return d
}
function getDefaultToDate() {
	return new Date()
}

function ReportModal() {
	const dispatch = useDispatch()
	const { closeModal } = useModal()
	const { isFetching, error } = useSelector(state => state.reports)

	const [fromDate, setFromDate] = useState(getDefaultFromDate())
	const [toDate, setToDate] = useState(getDefaultToDate())

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		setError,
		formState: { errors, isSubmitting: isFormLoading },
	} = useForm({
		defaultValues: {
			from: fromDate,
			to: toDate,

			format: 'pdf',

			includeDashboard: true,
			includeSales: true,
			includeBookings: false,
			includeIgloos: false,
			includeTrips: false,
		},
	})

	// sekcje
	const includeDashboard = watch('includeDashboard')
	const includeSales = watch('includeSales')
	const includeBookings = watch('includeBookings')
	const includeIgloos = watch('includeIgloos')
	const includeTrips = watch('includeTrips')

	const anySection = useMemo(() => {
		return includeDashboard || includeSales || includeBookings || includeIgloos || includeTrips
	}, [includeDashboard, includeSales, includeBookings, includeIgloos, includeTrips])

	const formatOptions = useMemo(
		() => [
			{ value: 'pdf', label: 'PDF' },
			{ value: 'xlsx', label: 'Excel (xlsx)' },
		],
		[]
	)

	const handleCloseModal = () => closeModal()

	const onFromChange = date => {
		setFromDate(date)
		setValue('from', date)
	}
	const onToChange = date => {
		setToDate(date)
		setValue('to', date)
	}

	const onSubmit = async data => {
		try {
			dispatch(clearReportsState())

			if (!anySection) {
				setError('formError', { type: 'manual', message: 'Select at least one section.' })
				return
			}

			// data.from / data.to to Date obiekty
			if (!data.from || !data.to) {
				setError('formError', { type: 'manual', message: 'Date range is required.' })
				return
			}

			if (data.from > data.to) {
				setError('formError', { type: 'manual', message: '"From" cannot be after "To".' })
				return
			}

			const dto = {
				from: formatDateOnly(data.from), // -> "YYYY-MM-DD"
				to: formatDateOnly(data.to),
				includeDashboard: !!data.includeDashboard,
				includeSales: !!data.includeSales,
				includeBookings: !!data.includeBookings,
				includeIgloos: !!data.includeIgloos,
				includeTrips: !!data.includeTrips,
				format: data.format, // 'pdf' | 'xlsx'
			}

			const action = await dispatch(generateReport(dto))

			if (generateReport.fulfilled.match(action)) {
				toast.success('Report generated')
				handleCloseModal()
				return
			}

			const msg = action?.payload?.message || action?.error?.message || 'Failed to generate report'
			setError('formError', { type: 'server', message: msg })
			toast.error(msg)
		} catch (e) {
			const msg = e?.message || 'Failed to generate report'
			setError('formError', { type: 'server', message: msg })
			toast.error(msg)
		}
	}

	return (
		<div className="report-modal">
			<div className="report-modal__header">
				<h2>Generate Report</h2>
				<p>Create a comprehensive report from your data</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="report-modal__content">
					{/* DATE RANGE & FORMAT SECTION */}
					<div className="report-modal__section">
						<h3 className="report-modal__section-title">Report Configuration</h3>
						<div className="report-modal__date-row">
							<div className="report-modal__field">
								<label>From Date</label>
								<div className="datepicker-wrapper">
									<Controller
										name="from"
										control={control}
										rules={{ required: 'From date is required' }}
										render={() => (
											<>
												<ReactDatePicker
													className={`input ${errors.from ? 'input-error' : ''}`}
													dateFormat="dd.MM.yyyy"
													shouldCloseOnSelect={true}
													selected={fromDate}
													onChange={onFromChange}
													withPortal
													showYearDropdown
													showMonthDropdown
												/>
												<DatePickerIcon />
											</>
										)}
									/>
								</div>
								{errors?.from?.message && <p className="error-message">{errors.from.message}</p>}
							</div>

							<div className="report-modal__field">
								<label>To Date</label>
								<div className="datepicker-wrapper">
									<Controller
										name="to"
										control={control}
										rules={{
											required: 'To date is required',
											validate: value => (value && fromDate && value >= fromDate) || '"To" cannot be before "From"',
										}}
										render={() => (
											<>
												<ReactDatePicker
													className={`input ${errors.to ? 'input-error' : ''}`}
													dateFormat="dd.MM.yyyy"
													minDate={fromDate}
													shouldCloseOnSelect={true}
													selected={toDate}
													onChange={onToChange}
													withPortal
													showYearDropdown
													showMonthDropdown
												/>
												<DatePickerIcon />
											</>
										)}
									/>
								</div>
								{errors?.to?.message && <p className="error-message">{errors.to.message}</p>}
							</div>

							<div className="report-modal__field">
								<label>Format</label>
								<Controller
									name="format"
									control={control}
									rules={{ required: 'Format is required' }}
									render={({ field: { onChange, value } }) => (
										<SelectComponent
											id="format"
											className={`react-select ${errors.format ? 'input-error' : ''}`}
											classNamePrefix="react-select"
											name="format"
											options={formatOptions}
											value={formatOptions.find(o => o.value === value) ?? formatOptions[0]}
											placeholder="Select format"
											onChangeFn={opt => onChange(opt?.value ?? 'pdf')}
										/>
									)}
								/>
								{errors?.format?.message && <p className="error-message">{errors.format.message}</p>}
							</div>
						</div>
					</div>

					{/* SECTIONS TO INCLUDE */}
					<div className="report-modal__section">
						<h3 className="report-modal__section-title">Include Sections</h3>
						<div className="report-modal__checkboxes">
							<label className="report-modal__checkbox-label">
								<input type="checkbox" {...register('includeDashboard')} />
								<span>Dashboard Summary</span>
							</label>

							<label className="report-modal__checkbox-label">
								<input type="checkbox" {...register('includeSales')} />
								<span>Sales Series (Current vs Previous Year)</span>
							</label>

							<label className="report-modal__checkbox-label">
								<input type="checkbox" {...register('includeBookings')} />
								<span>Bookings Overview</span>
							</label>

							<label className="report-modal__checkbox-label">
								<input type="checkbox" {...register('includeIgloos')} />
								<span>Igloos KPI</span>
							</label>

							<label className="report-modal__checkbox-label">
								<input type="checkbox" {...register('includeTrips')} />
								<span>Trips Catalog</span>
							</label>
						</div>
						{!anySection && <p className="error-message">Please select at least one section</p>}
					</div>

					{/* ERROR MESSAGES */}
					{(errors?.formError?.message || error) && (
						<p className="error-message">{errors?.formError?.message || error}</p>
					)}
				</div>

				{/* FOOTER WITH BUTTONS */}
				<div className="report-modal__footer">
					<Button
						className="cancel-btn"
						onClick={handleCloseModal}
						type="button"
						disabled={isFetching || isFormLoading}>
						Cancel
					</Button>

					<Button type="submit" disabled={isFetching || isFormLoading || !anySection}>
						{(isFetching || isFormLoading) && <Spinner className="form" />}
						{!(isFetching || isFormLoading) && 'Generate Report'}
					</Button>
				</div>
			</form>
		</div>
	)
}

export default ReportModal
