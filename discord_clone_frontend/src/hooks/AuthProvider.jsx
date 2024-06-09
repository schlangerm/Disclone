import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("AuthToken"));
    const navigate = useNavigate();
    
    const loginAction = async (data) => {
        try {
            const response = await fetch("http://localhost:3001/auth/login", {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data), 
            });
            console.log('response finished successfully')
            const res = await response.json();
            if (res.user) {
                setUser(res.user);
                setToken(res.token);
                localStorage.setItem("AuthToken", res.token);
                navigate('/');
                console.log('token successful')
                return;
            }
            throw new Error(res.error);
        } catch (err) {
            console.error(err);
        }
    };

    const registerAction = async (data) => {
        try {
            console.log('hi register,', data);
            const response = await fetch("http://localhost:3001/auth/register", {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();
            if (res.success) {
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
