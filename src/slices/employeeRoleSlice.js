import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { logout } from "./authSlice"

const initialState = {
    employeeRoles : [],
    isFetching: false,
    error: '',
}

export const fetchEmployeeRoles = createAsyncThunk('employeeRoles/fetchEmployeeRoles', async (_, {getState, rejectWithValue}) => {
    const token = getState().auth.accessToken
    const res = await fetch('http://localhost:5212/api/EmployeeRoles', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    const data = await res.json()
    return data
})

export const addNewEmployeeRole = createAsyncThunk('employeeRoles/addNewEmployeeRole', async (newEmployeeRole, {getState, rejectWithValue }) => {
    const token = getState().auth.accessToken
    const res = await fetch('http://localhost:5212/api/EmployeeRoles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: newEmployeeRole,
    })

    if (!res.ok) {
        throw rejectWithValue({ message: 'Failed to add new employee role' })
    }

    const data = await res.json()
    return data
})

export const editEmployeeRole = createAsyncThunk(
    'employeeRoles/editEmployeeRole',
    async ({ id, updatedEmployeeRole }, {getState, rejectWithValue }) => {
        try {
            const token = getState().auth.accessToken
            const res = await fetch(`http://localhost:5212/api/EmployeeRoles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: updatedEmployeeRole,
            })

            if (!res.ok) {
                const errorBody = await res.json().catch(() => null)
                console.error('Error response body:', errorBody)
                return rejectWithValue(errorBody || { message: 'Failed to edit employee role' })
            }

            // 204 NoContent – nie próbujemy parsować JSON-a
            return { id }
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const deleteEmployeeRole = createAsyncThunk('employeeRoles/deleteEmployeeRole', async (id, {getState, rejectWithValue }) => {
    const token = getState().auth.accessToken
    const res = await fetch(`http://localhost:5212/api/EmployeeRoles/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    if (!res.ok) {
        throw rejectWithValue({ message: 'Failed to delete employee role' })
    }

    return id
})

export const employeeRoleSlice = createSlice({
    name: 'employeeRoles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeeRoles.pending, (state) => {
                state.isFetching = true
            })
            .addCase(fetchEmployeeRoles.fulfilled, (state, action) => {
                state.isFetching = false
                state.employeeRoles = action.payload
            })
            .addCase(fetchEmployeeRoles.rejected, (state, action) => {
                state.isFetching = false
                state.error = action.error.message
            })
            .addCase(addNewEmployeeRole.fulfilled, (state, action) => {
                state.employeeRoles.push(action.payload)
                state.isFetching = false
                state.error = ''
            })
            .addCase(addNewEmployeeRole.rejected, (state, action) => {
                state.isFetching = false
                state.error = action.error.message
            })
            .addCase(addNewEmployeeRole.pending, (state) => {
                state.isFetching = true
            })
            .addCase(editEmployeeRole.fulfilled, (state, action) => {
                const index = state.employeeRoles.findIndex((role) => role.id === action.payload.id)
                if (index !== -1) {
                    state.employeeRoles[index] = {
                        ...state.employeeRoles[index],
                        ...action.payload.updatedEmployeeRole,
                    }
                }
                state.isFetching = false
                state.error = ''
            })
            .addCase(editEmployeeRole.rejected, (state, action) => {
                state.isFetching = false
                state.error = action.error.message
            })
            .addCase(editEmployeeRole.pending, (state) => {
                state.isFetching = true
            })
            .addCase(deleteEmployeeRole.fulfilled, (state, action) => {
                state.employeeRoles = state.employeeRoles.filter((role) => role.id !== action.payload)
                state.error = ''
                state.isFetching = false
            })
            .addCase(deleteEmployeeRole.rejected, (state, action) => {
                state.isFetching = false
                state.error = action.error.message
            })
            .addCase(deleteEmployeeRole.pending, (state) => {
                state.isFetching = true
            })
            .addCase(logout, state => {
                state.employeeRoles = []
                state.error = ''
                state.isFetching = false
            })
    },
})

export default employeeRoleSlice.reducer