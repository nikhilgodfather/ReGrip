import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import App from "./App"
import LoginPage from "./pages/LoginPage/LoginPage"
import { BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import SidebarProvider from "./components/Sidebar/currentSelected";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";

const Main = () => {
    // const navigate = useNavigate();

    const [isloggedIn, setIsloggedIn] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsloggedIn(true)
        }
        else {
            setIsloggedIn(false)
        }
    }, [])


    return (
        <SidebarProvider>
            <Router>
                <Routes>
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/login" element={<LoginPage setIsloggedIn={setIsloggedIn} isloggedIn={isloggedIn} />} />
                    <Route path="/*" element={isloggedIn ? <App setIsloggedIn={setIsloggedIn} /> : <Navigate to="/login" />} />
                </Routes>
            </Router>
        </SidebarProvider >
    )
}

export default Main