import {  createContext, useContext,useEffect,useState } from "react";
import { getMyDetails } from "../services/Auth";

interface AuthContextType{
    user:any;
    setUser: (user:any) => void;
    loading: boolean
}

const AuthContext = createContext<AuthContextType | null >(null)

export const AuthProvider = ({children} : {children : React.ReactNode}) =>{
    const [user,setUser ] =useState<any>(null)
    const [loading , setLoading] = useState(true)

    useEffect(() =>{
        const token = localStorage.getItem("accessToken")
        if(token) {
            getMyDetails(token).then((res) =>{
                setUser( {...res.data , token})
            }).catch((err) =>{
                setUser(null)
                setLoading(false)
                console.error(err)
                return
            }).finally(() =>{
                setLoading(false)
            })
        } else {
            setUser(null)
            setLoading(false)
        }
    }, [])

    return(
        <AuthContext.Provider value={{user ,setUser ,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}