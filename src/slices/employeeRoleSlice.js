import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    employeeRoles : [],
    isFetching: false,
    error: '',
}

export const fetchEmployeeRoles = createAsyncThunk('employeeRoles/fetchEmployeeRoles', async () => {
    const res = await fetch('http://localhost:5212/api/EmployeeRoles')
    const data = await res.json()
    return data
})

export const addNewEmployeeRole = createAsyncThunk('employeeRoles/addNewEmployeeRole', async (newEmployeeRole, { rejectWithValue }) => {
    const res = await fetch('http://localhost:5212/api/EmployeeRoles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
    async ({ id, updatedEmployeeRole }, { rejectWithValue }) => {
        try {
            const res = await fetch(`http://localhost:5212/api/EmployeeRoles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
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

export const deleteEmployeeRole = createAsyncThunk('employeeRoles/deleteEmployeeRole', async (id, { rejectWithValue }) => {
    const res = await fetch(`http://localhost:5212/api/EmployeeRoles/${id}`, {
        method: 'DELETE',
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
            })
            .addCase(editEmployeeRole.fulfilled, (state, action) => {
                const index = state.employeeRoles.findIndex((role) => role.id === action.payload.id)
                if (index !== -1) {
                    state.employeeRoles[index] = {
                        ...state.employeeRoles[index],
                        ...action.payload.updatedEmployeeRole,
                    }
                }
            })
            .addCase(deleteEmployeeRole.fulfilled, (state, action) => {
                state.employeeRoles = state.employeeRoles.filter((role) => role.id !== action.payload)
            })
    },
})

export default employeeRoleSlice.reducer