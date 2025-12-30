import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from './authSlice'
import { apiFetch } from './_fetchWithAuth'

const initialState = {
	employees: [],
	status: 'idle',
	isFetching: false,
	error: '',
}

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
	const res = await fetch('http://localhost:5212/api/Employees')
	const data = await res.json()
	console.log(data)
	return data
})

export const addNewEmployee = createAsyncThunk('employees/addNewEmployee', async (newEmployye, thunkApi) => {
	return await apiFetch(
		'/Employees',
		{
			method: 'POST',
			body: newEmployye,
		},
		thunkApi
	)
})

export const editEmployee = createAsyncThunk('employees/editEmployee', async ({ id, updatedEmployee }, thunkApi) => {
	const result = await apiFetch(
		`/Employees/${id}`,
		{
			method: 'PUT',
			body: updatedEmployee,
		},
		thunkApi
	)

	//  JEŚLI backend zwrócił 204 → sami składamy payload
	return result ?? { id }
})

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id, thunkApi) => {
	const result = await apiFetch(
		`/Employees/${id}`,
		{
			method: 'DELETE',
		},
		thunkApi
	)

	//  JEŚLI backend zwrócił 204 → sami składamy payload
	return result ?? id
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
				state.isFetching = false
			})
			.addCase(addNewEmployee.rejected, (state, action) => {
				state.error = action.payload.message
				state.isFetching = false
			})
			.addCase(addNewEmployee.pending, state => {
				state.isFetching = true
			})
			.addCase(editEmployee.fulfilled, (state, action) => {
				state.isEditing = false
				state.isFetching = false
				state.error = ''
			})
			.addCase(editEmployee.rejected, (state, action) => {
				state.error = action.payload.message
			})
			.addCase(editEmployee.pending, state => {
				state.isFetching = true
			})
			.addCase(deleteEmployee.fulfilled, (state, action) => {
				state.employees = state.employees.filter(emp => emp.id !== action.payload)
				state.error = ''
				state.isFetching = false
			})
			.addCase(deleteEmployee.rejected, (state, action) => {
				state.error = action.payload.message
				state.isFetching = false
			})
			.addCase(deleteEmployee.pending, state => {
				state.isFetching = true
			})
			.addCase(logout, state => {
				state.employees = []
				state.error = ''
				state.status = 'idle'
				state.isFetching = false
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
