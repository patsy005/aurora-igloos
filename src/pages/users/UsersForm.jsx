import toast from 'react-hot-toast'
import Button from '../../components/Button'
import Spinner from '../../components/spinner/Spinner'
import { addNewUser, fetchUsers, editUser as editUserThunk } from '../../slices/usersSlice'
import CreateAccountType from './form/CreateAccountType'
import CreateCustomerFlow from './form/CreateCustomerFlow'
import CreateEmployeeInfo from './form/CreateEmployeeInfo'
import EditUserFields from './form/EditUserFields'
import CustomersForm from '../Customers/CustomersForm'
import EmployeesForm from '../Employees/EmployeesForm'
import { useEffect, useMemo } from 'react'
import { findExistingCustomerByEmail } from '../../utils/utils'
import { fetchCustomers } from '../../slices/customersSLice'
import { fetchUserTypes } from '../../slices/userTypesSlice'
import { fetchUserRoles } from '../../slices/userRoleSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../contexts/modalContext'
import { useForm } from 'react-hook-form'

function UsersForm() {
	const customers = useSelector(state => state.customers.customers)
	const users = useSelector(state => state.users.users)
	const userTypes = useSelector(state => state.userTypes.userTypes)
	const userRoles = useSelector(state => state.userRoles.userRoles)

	const dispatch = useDispatch()
	const { closeModal, openModal, props } = useModal()

	// props from modal: { id, user }
	const modalData = props
	const isEdit = Boolean(modalData?.id && modalData?.user) || Boolean(modalData?.user?.id) // edit jeśli mamy usera
	const isCreate = !isEdit

	// FULL USER DO EDIT
	const userToEdit = modalData?.user ?? null

	const {
		register,
		handleSubmit,
		setValue,
		setError,
		control,
		watch,
		formState: { errors, isSubmitting: isFormLoading },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
			userRoleId: '',
			userTypeId: '',
			employeeId: '',
			customerId: '',
			accountFor: '',
			customerEmail: '',
		},
	})

	const handleCloseModal = () => closeModal()

	const accountFor = watch('accountFor')
	const customerEmail = watch('customerEmail')

	const userCustomer = isCreate && accountFor === 'customer'
	const userEmployee = isCreate && accountFor === 'employee'

	useEffect(() => {
		dispatch(fetchUserTypes())
		dispatch(fetchUserRoles())
		dispatch(fetchUsers())

		if (isCreate) dispatch(fetchCustomers())
	}, [dispatch, isCreate])

	console.log('user types:', userTypes)

	// ===== PREFILL EDIT MODE USING setValue =====
	useEffect(() => {
		if (!isEdit) return
		if (!userToEdit) return

		setValue('login', userToEdit.login ?? '')
		setValue('password', '')

		// u Ciebie są userRoleId/userTypeId
		setValue('userRoleId', userToEdit.userRoleId ? String(userToEdit.userRoleId) : '')
		setValue('userTypeId', userToEdit.userTypeId ? String(userToEdit.userTypeId) : '')

		setValue('employeeId', userToEdit.employeeId ? String(userToEdit.employeeId) : '')
		setValue('customerId', userToEdit.customerId ? String(userToEdit.customerId) : '')

		setValue('accountFor', '')
		setValue('customerEmail', '')
	}, [isEdit, userToEdit, setValue])

	// Options for selects
	const userRoleOptions = useMemo(
		() => [
			{ value: '', label: 'Select user role' },
			...(userRoles ?? []).map(r => ({ value: String(r.id), label: r.name })),
		],
		[userRoles]
	)

	const userTypeOptions = useMemo(
		() => [
			{ value: '', label: 'Select user type' },
			...(userTypes ?? []).map(t => ({ value: String(t.id), label: t.type })),
		],
		[userTypes]
	)

	// Find existing customer by email (create customer flow only)
	const existingCustomer = useMemo(() => {
		if (!customers?.length || !customerEmail || !userCustomer) return null
		return findExistingCustomerByEmail(customers, customerEmail)
	}, [customers, customerEmail, userCustomer])

	// Check if customer has user account
	const customerHasUser = useMemo(() => {
		if (!existingCustomer || !users?.length) return false
		return users.some(u => u.customerId === existingCustomer.id)
	}, [existingCustomer, users])

	// Update customerId when existing customer found
	useEffect(() => {
		if (!isCreate) return
		if (!userCustomer) {
			setValue('customerId', '')
			return
		}
		setValue('customerId', existingCustomer ? String(existingCustomer.id) : '')
	}, [existingCustomer, isCreate, setValue, userCustomer])

	// Clear fields when switching account type (create mode)
	useEffect(() => {
		if (!isCreate) return

		setValue('login', '')
		setValue('password', '')
		setValue('userRoleId', '')
		setValue('userTypeId', '')
		setValue('employeeId', '')
		setValue('customerId', '')

		if (accountFor === 'employee') setValue('customerEmail', '')
	}, [accountFor, isCreate, setValue])

	const openCustomerForm = () => openModal(CustomersForm, {})
	const openEmployeeForm = () => openModal(EmployeesForm, {})

	const canSubmitCreateCustomerUser =
		isCreate && userCustomer && Boolean(customerEmail) && Boolean(existingCustomer) && !customerHasUser

	const onSubmit = async data => {
		try {
			// EDIT
			if (isEdit) {
				const updatedUser = {
					id: userToEdit.id,
					login: data.login,
					userRoleId: parseInt(data.userRoleId, 10),
					userTypeId: parseInt(data.userTypeId, 10),
					customerId: userToEdit.customerId ?? null,
					employeeId: userToEdit.employeeId ?? null,
					...(data.password ? { password: data.password } : {}),
				}

				await dispatch(editUserThunk({ id: userToEdit.id, updatedUser })).unwrap()
				toast.success('User updated successfully')
				handleCloseModal()
				dispatch(fetchUsers())
				return
			}

			// CREATE
			if (userEmployee) {
				toast('Create the employee first (user is created there).')
				return
			}

			if (!canSubmitCreateCustomerUser) {
				toast.error('Cannot create user: customer not found or already has an account.')
				return
			}

			const newUser = {
				login: data.login,
				password: data.password,
				userRoleId: parseInt(data.userRoleId, 10),
				userTypeId: parseInt(data.userTypeId, 10),
				employeeId: null,
				customerId: existingCustomer?.id ? parseInt(existingCustomer.id, 10) : parseInt(data.customerId, 10),
			}

			await dispatch(addNewUser(newUser)).unwrap()
			toast.success('User created successfully')
			handleCloseModal()
			dispatch(fetchUsers())
		} catch (error) {
			toast.error('Failed to save user')
			setError('formError', { type: 'server', message: error?.message ?? 'Server error' })
		}
	}

	return (
		<form className="form mt-5 row" onSubmit={handleSubmit(onSubmit)}>
			<h2>{isEdit ? 'Edit User' : 'Create New User'}</h2>

			{/* EDIT MODE */}
			{isEdit && (
				<EditUserFields
					register={register}
					control={control}
					errors={errors}
					userRoleOptions={userRoleOptions}
					userTypeOptions={userTypeOptions}
				/>
			)}

			{/* CREATE MODE */}
			{isCreate && (
				<>
					<CreateAccountType register={register} errors={errors} />

					{userEmployee && <CreateEmployeeInfo openEmployeeForm={openEmployeeForm} />}

					{userCustomer && (
						<CreateCustomerFlow
							register={register}
							errors={errors}
							customerEmail={customerEmail}
							existingCustomer={existingCustomer}
							customerHasUser={customerHasUser}
							openCustomerForm={openCustomerForm}
							control={control}
							userRoleOptions={userRoleOptions}
							userTypeOptions={userTypeOptions}
						/>
					)}
				</>
			)}

			{errors?.formError?.message && (
				<div className="col-12 mt-4">
					<p className="error-message">{errors.formError.message}</p>
				</div>
			)}

			<div className="d-flex justify-content-end text-end form-btns">
				<Button className="cancel-btn" onClick={handleCloseModal} type="button">
					Cancel
				</Button>

				{/* Submit tylko gdy: edit, albo create-customer i można utworzyć usera */}
				{(isEdit || canSubmitCreateCustomerUser) && (
					<Button type="submit" disabled={isFormLoading}>
						{isFormLoading && <Spinner className="form" />}
						{!isFormLoading && (isEdit ? 'Update User' : 'Create User')}
					</Button>
				)}
			</div>
		</form>
	)
}

export default UsersForm
