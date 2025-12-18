import { BrowserRouter , Routes , Route , Navigate} from "react-router-dom";
import { Suspense ,lazy, type ReactNode} from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import SearchProperties from "../pages/SearchProperties";
import SavedProperties from "../pages/SavedProperties";
import MyProfile from "../pages/MyProfile";
import MyInquaries from "../pages/MyInquaries";
import CreateNewListning from "../pages/CreateNewListning";
import ManageListnings from "../pages/ManageListnings";
import MyListings from "../pages/MyListnings";
import ManageUsers from "../pages/ManageUsers";
import PropertyApproval from "../pages/PropertyApproval";

const Welcome = lazy(() => import("../pages/Welcome"))
const Signin = lazy(() => import("../pages/Signin"))
const Signup = lazy(() => import("../pages/Signup"))
const Home = lazy(() => import("../pages/Home"))

type RequiredAuthTypes = {children : ReactNode; roles?: string[]};

const RequiredAuth = ({children , roles} : RequiredAuthTypes) =>{
    const {user , loading} = useAuth()

    if(loading) {
        return(
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        )
    }

    if(!user) {
        return<Navigate to ="/signin" replace/>
    }

    if(roles && !roles.some((role) => user.roles?.includes(role))){
        return (
            <div className="text-center py-20">
                <h1 className="text-xl font-bold mb-2">Access denied</h1>
                <p>You dont have the permission to access this profile</p>
            </div>
        );
    }
    return <>{children}</>
}

export default function Router() {
    return(
        <BrowserRouter>
            <Suspense
            fallback = {<div className="text-center mt-20 text-xl">Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/signin" element = {<Signin/>} />
                    <Route path="/signup" element = {<Signup/>}/>

                    <Route element={
                            <RequiredAuth>
                                <Layout/>
                            </RequiredAuth>
                        }
                    >
                        <Route path="/home" element = {<Home/>}/>
                        <Route path="/search" element= {<SearchProperties/>}/>
                        <Route path="/favourites" element= {<SavedProperties/>}/>
                        <Route path="/editme" element= {<MyProfile/>}/>
                        <Route path="/inquaries" element= {<MyInquaries/>}/>

                        <Route path="/createListnings" element= {<CreateNewListning/>}/>
                        <Route path="/manageListnings" element= {<ManageListnings/>}/>
                        <Route path="/listning/:id" element= {<MyListings/>}/>
                        <Route path="/admin/manage-users" element={<ManageUsers />} />
                        <Route path="listning/" element={ <PropertyApproval/>} />



                    </Route>
                </Routes>

                {/* Footer */}
                <footer className="bg-gray-100 text-gray-700 py-4 text-center">
                    <p>© 2025 Your Name. All rights reserved.</p>
                </footer>
            </Suspense>
        </BrowserRouter>
    )
}