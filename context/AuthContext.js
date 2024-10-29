import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const setAuth = authUser => {
        setUser(authUser);
    }

    const setUserData = UserData =>{
        setUser({...UserData});
    }

    return(
        <AuthContext.Provider
        value={{user, setAuth, setUserData}}>
            {children}
        </AuthContext.Provider>
    )

    };
    //export default AuthProvider;
    export const useAuth = () => useContext(AuthContext);