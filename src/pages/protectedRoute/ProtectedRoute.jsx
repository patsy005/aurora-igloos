import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../slices/authSlice'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
	const isAuthenticated = useSelector(selectIsAuth)

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}
	return <>{children}</>
}

export default ProtectedRoute
