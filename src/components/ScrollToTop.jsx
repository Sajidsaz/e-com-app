import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls window to top whenever the route's pathname changes.
// Mounted inside <App /> (which lives inside <BrowserRouter />).
const ScrollToTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

export default ScrollToTop