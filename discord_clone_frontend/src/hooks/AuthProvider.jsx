import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [email, setEmail] = useState(null); //replace all three of these with 
    const [id, setId] = useState(null);         //
    const [name, setName] = useState(null);     //
    // const [user, setUser] = useState(null); user object
    const [token, setToken] = useState(localStorage.getItem("AuthToken"));
    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        console.log("UseEffect is running");
        const token = localStorage.getItem('AuthToken');
        if (token) {
            try {
                //console.log("Theres a token :)")
                const decoded = jwtDecode(token);
                setId(decoded.id)
                //api call to get user info
                //construct user object with user info
                setName(decoded.name);
                setEmail(decoded.email);
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
                setEmail(res.data.user.email);
                setId(res.data.user.id)
                setName(res.data.user.name)
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
                setEmail(res.data.user.email);
                setId(res.data.user.id);
                setName(res.data.user.name);
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
        setEmail(null);
        setId(null);
        setName(null);
        setToken("");
        localStorage.removeItem("AuthToken");
        navigate("/login");
        return;
    };

    return (                                    //replace these three with user object
        <AuthContext.Provider value = {{ token, email, id, name, loginAction, logOut, registerAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}
