import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useURL } from "./URLProvider";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("AuthToken"));
    const navigate = useNavigate();
    const { backendURL } = useURL();

    useEffect(() => {
        console.log("UseEffect is running");
        const token = localStorage.getItem('AuthToken');
        if (token) {
            try {
                //console.log("Theres a token :)")
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error(error);
                localStorage.removeItem('AuthToken');
            }
        }
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
                setUser(res.data.user);
                console.log('resdatauser exists!', res.data.user)
                setToken(res.data.token);
                localStorage.setItem("AuthToken", res.data.token);
                navigate('/');
                console.log('token successful')
                return;
            }
            else {
                setToken("");
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
                setUser(res.data.user);
                setToken(res.data.token);
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
        setToken("");
        localStorage.removeItem("AuthToken");
        navigate("/login");
        return;
    };

    return (
        <AuthContext.Provider value = {{ token, user, loginAction, logOut, registerAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}
