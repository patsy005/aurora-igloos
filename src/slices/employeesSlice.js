import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	employees: [],
	status: 'idle',
	isFetching: false,
	isCreating: false,
	isEditing: false,
	error: '',
}

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
	const res = await fetch('http://localhost:5212/api/Employees')
	const data = await res.json()
	console.log(data)
	return data
})

export const addNewEmployee = createAsyncThunk('employees/addNewEmployee', async (newEmployye, { rejectWithValue }) => {
	const res = await fetch('http://localhost:5212/api/Employees', {
		method: 'POST',
		body: newEmployye,
	})

	if (!res.ok) {
		throw rejectWithValue({ message: 'Failed to add new employee' })
	}

	const data = await res.json()
	return data
})

export const editEmployee = createAsyncThunk(
	'employees/editEmployee',
	async ({ id, updatedEmployee }, { rejectWithValue }) => {
		try {
			const res = await fetch(`http://localhost:5212/api/Employees/${id}`, {
				method: 'PUT',
				body: updatedEmployee,
			})

			if (!res.ok) {
				const errorBody = await res.json().catch(() => null)
				console.error('Error response body:', errorBody)
				return rejectWithValue(errorBody || { message: 'Failed to edit emplyoyee' })
			}

			// 204 NoContent – nie próbujemy parsować JSON-a
			return { id }
		} catch (err) {
			return rejectWithValue(err.message)
		}
	}
)

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id, { rejectWithValue }) => {
	const res = await fetch(`http://localhost:5212/api/Employees/${id}`, {
		method: 'DELETE',
	})

	if (!res.ok) {
		throw rejectWithValue({ message: 'Failed to delete employee' })
	}

	return id
})

export const employeesSlice = createSlice({
	name: 'employees',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchEmployees.fulfilled, (state, action) => {
				state.employees = action.payload
				state.status = 'idle'
				state.isFetching = false
				state.error = ''
			})
			.addCase(fetchEmployees.pending, state => {
				state.status = 'loading'
				state.isFetching = true
			})
			.addCase(fetchEmployees.rejected, (state, action) => {
				state.status = 'error'
				state.error = action.error.message
				state.isFetching = false
			})
			.addCase(addNewEmployee.fulfilled, (state, action) => {
				state.employees.push(action.payload)
				state.error = ''
			})
			.addCase(addNewEmployee.rejected, (state, action) => {
				state.error = action.payload.message
			})
			.addCase(editEmployee.fulfilled, (state, action) => {
				// const index = state.employees.findIndex(emp => emp.id === action.payload.id)
				// if (index !== -1) {
				// 	state.employees[index] = {
				// 		...state.employees[index],
				// 		...action.payload.updatedEmployee,
				// 	}
				// }
				// state.error = ''
				state.isEditing = false
				state.isFetching = false
				state.error = ''
			})
			.addCase(editEmployee.rejected, (state, action) => {
				state.error = action.payload.message
			})
			.addCase(deleteEmployee.fulfilled, (state, action) => {
				state.employees = state.employees.filter(emp => emp.id !== action.payload)
				state.error = ''
			})
			.addCase(deleteEmployee.rejected, (state, action) => {
				state.error = action.payload.message
			})
	},
})

export default employeesSlice.reducer

export const selectEmployeeById = (state, id) => {
	const employee = state.employees.employees.find(emp => emp.id === id)
	return employee
}

export const selectEmployeeIdByUserId = (state, userId) => {
	const employee = state.employees.employees.find(emp => emp.idUser === userId)
	if (!employee) return null
	return employee.id
}

export const selectEmployeeByName = (state, name) => {
	const employee = state.employees.employees.find(emp => emp.name === name)
	return employee
}

export const selectEmployeeBySurname = (state, surname) => {
	const employee = state.employees.employees.find(emp => emp.surname === surname)
	return employee
}

export const selectEmployees = state => state.employees.employees
