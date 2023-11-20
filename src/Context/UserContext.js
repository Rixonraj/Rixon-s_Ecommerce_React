import { createContext, useState } from "react";



export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [counter, setcounter] = useState(0);

    return <UserContext.Provider value={{ counter, setcounter}}>{children}</UserContext.Provider>
};