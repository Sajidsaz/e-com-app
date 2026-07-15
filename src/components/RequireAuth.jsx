import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

// Route guard for pages that require a logged-in user (checkout, orders,
// profile, account). Waits for `authChecked` so a refresh on a protected page
// doesn't redirect a logged-in user before their token is restored from
// localStorage. Unauthenticated users are sent to /login, remembering where
// they were headed via location state.
const RequireAuth = ({ children }) => {
    const { token, authChecked } = useContext(ShopContext)
    const location = useLocation()

    if (!authChecked) return null

    if (!token) {
        return <Navigate to='/login' replace state={{ from: location }} />
    }

    return children
}

export default RequireAuth
