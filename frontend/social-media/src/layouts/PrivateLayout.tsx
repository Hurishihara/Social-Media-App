import { useAuth } from '../AuthContext'
import { Navigate, Outlet } from 'react-router'

export const PrivateLayout = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to='/' replace />
    }

    return (
        <div>
            <Outlet />
        </div>
    )
}