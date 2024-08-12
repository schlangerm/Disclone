import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "../classes/User";
//import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        const fetchUserData = async () => {
            console.log("UseEffect is running");
            const token = localStorage.getItem('AuthToken');
            if (token) {
                try {
                    const response = await fetch(`${backendURL}/api/user`, {
                        method: "get",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer: ${token}`
                        }
                    });
                    const res = await response.json();
                    if (res.success) {
                        console.log("user data obtained successfully")
                        const ActiveUser = new User(res.data.user.email, res.data.user.name, res.data.user.id);
                        setUser(ActiveUser);
                    } else {
                        console.log("setting user went wrong");
                    }
                } catch (error) {
                    console.error(error);
                    localStorage.removeItem('AuthToken');
                }
            }
        };

        fetchUserData();
    }, []); //empty dependency array so that it only runs once, when component mounts
    
    const loginAction = async (data) => {
        try {
            const response = await fetch(`${backendURL}/auth/login`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data), 
            });
            const res = await response.json();
            console.log('response is:', res)
            if (res.error) {
                alert(res.error);
                navigate('/login');
                return;
            }
            if (res.data.user) {
                const ActiveUser = new User(res.data.user.email, res.data.user.name, res.data.user.id);
                setUser(ActiveUser);
                localStorage.setItem("AuthToken", res.data.token);
                navigate('/');
                console.log('token successful')
                return;
            }
            else {
                localStorage.removeItem("AuthToken");
                navigate('/login');
                alert('Something went wrong, please log in');
            }
            throw new Error(res.error);
        } catch (err) {
            console.error(err);
        }
    };

    const registerAction = async (data) => {
        try {
            console.log('hi register,', data);
            const response = await fetch(`${backendURL}/auth/register`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();
            if (res.success) {
                const ActiveUser = new User(res.data.user.email, res.data.user.name, res.data.user.id);
                setUser(ActiveUser);
                localStorage.setItem("AuthToken", res.data.token);
                navigate('/');
                return;
            }
            throw new Error(res.error);
        } catch (err) {
            console.error(err);
        }
    };

    const logOut = () => {
        setUser(null);
        localStorage.removeItem("AuthToken");
        navigate("/login");
        return;
    };

    return (                                    
        <AuthContext.Provider value = {{ user, loginAction, logOut, registerAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}
