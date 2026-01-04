import axios , {AxiosError} from "axios";
import { handleRefreshToken } from "./Auth";

const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL + "/api/v1",
    withCredentials: true,
    headers : {
        "Content-Type" : 'application/json'
    }
})

const PUBLIC_ENDPOINTS = ["/auth/signin" , "auth/signup"]

api.interceptors.request.use((config) =>{
    const accessToken = localStorage.getItem("accessToken")

    console.log(import.meta.env.VITE_API_URL);
    
    const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))

    if (accessToken && !isPublic) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (response) => {return response} ,
    async (err: AxiosError) => {
        const originalRequest : any = err.config

        const isPublic = PUBLIC_ENDPOINTS.some((url) =>
            originalRequest.url?.includes(url)
        )

        if(err.response?.status === 401 && !isPublic && !originalRequest._retry){
            originalRequest._retry = true
            try{
                const refreshToken = localStorage.getItem("refreshToken")

                if(!refreshToken) {
                    throw new Error("No refresh token available")
                }
                const res = await handleRefreshToken(refreshToken)
                localStorage.setItem("accessToken" , res.accessToken)

                originalRequest.headers.Authorization = `Bearer ${res.accessToken}`
                return axios(originalRequest)
            } catch(err){
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                window.location.href = "/signin"
                return Promise.reject(err)
            }
        }
        return Promise.reject(err)
    }
)

export default api