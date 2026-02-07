import React, {createContext, useContext, useEffect, useState} from 'react'

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}: {children: React.ReactNode}){

    const [theme, setTheme] = useState(()=>localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark").matches ? "dark" : "light"));

    // Update theme when state changes
    useEffect(()=>{
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }

    return <ThemeContext.Provider value={{theme, toggleTheme}}>
        {children}
    </ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if(context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context;
}