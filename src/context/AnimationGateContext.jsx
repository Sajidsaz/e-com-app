import React, { createContext, useContext, useState } from 'react'

const SPLASH_KEY = 'heysaz_splash_shown'

const AnimationGateContext = createContext({
    ready: true,
    markSplashShown: () => {},
})

export const AnimationGateProvider = ({ children }) => {
    const alreadyShown =
        typeof window !== 'undefined' && sessionStorage.getItem(SPLASH_KEY) === 'true'

    const [ready, setReady] = useState(alreadyShown)

    const markSplashShown = () => {
        try {
            sessionStorage.setItem(SPLASH_KEY, 'true')
        } catch {
            // sessionStorage unavailable (e.g. privacy mode) — safe to ignore
        }
        setReady(true)
    }

    return (
        <AnimationGateContext.Provider value={{ ready, markSplashShown }}>
            {children}
        </AnimationGateContext.Provider>
    )
}

export const useAnimationGate = () => useContext(AnimationGateContext)

export const hasSplashAlreadyShown = () => {
    try {
        return sessionStorage.getItem(SPLASH_KEY) === 'true'
    } catch {
        return true
    }
}
