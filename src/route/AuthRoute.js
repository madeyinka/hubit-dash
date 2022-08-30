import { useLocation, Navigate, Outlet} from 'react-router-dom'
import useAuth from './../hooks/useAuth'

const AuthRoute = () => {
    const { auth } = useAuth()
    const location = useLocation()

    return (
        auth?.token 
                ? <Outlet />
                : <Navigate to="/auth-login" state={{ from: location}} replace />
    )
}

export default AuthRoute