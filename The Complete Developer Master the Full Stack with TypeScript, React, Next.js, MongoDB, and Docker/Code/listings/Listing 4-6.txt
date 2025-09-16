import React, { useState, createContext, useContext } from "react";

export default function App() {
    const ThemeContext = createContext("");
    
    const ContextComponent = (): JSX.Element => {
    
        const [theme, setTheme] = useState("dark");
    
        return (
            <div>
                <ThemeContext.Provider value={theme}>
                    <button onClick={() => setTheme(theme == "dark" ? "light" : "dark")}>
                        Toggle theme
                    </button>
                    <Headline />
                    </ThemeContext.Provider>
            </div>
        );
    };

    const Headline = (): JSX.Element => {
        const theme = useContext(ThemeContext);
        return (<h1 className={theme}>Current theme: {theme}</h1>);
    };

    return (<ContextComponent />);
}
