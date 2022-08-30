import React, { createContext, useState } from "react"

export const GlobalContext = createContext({})

export const GlobalProvider = ({children}) => {

    //get and set current user here...
    const [auth, setAuth] = useState({})


    return (<GlobalContext.Provider value={{auth, setAuth}}>{children}</GlobalContext.Provider>)
}