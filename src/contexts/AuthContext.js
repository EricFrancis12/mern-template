import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(Cookies.get('loggedIn') === 'true' ? true : false);

    function handleAuthEvent(data) {
        if (data.setLoggedIn === true) {
            setLoggedIn(true);
            Cookies.set('loggedIn', 'true', { expires: 7, path: '/' });
        } else if (data.setLoggedIn === false) {
            setLoggedIn(false);
            Cookies.remove('loggedIn');
        }

        setLoading(false);
    }

    async function pingServer(url = '', args = {}, method = 'POST') {
        if (!url) throw new Error('No url provided');

        const { email, password } = args;

        return fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            method,
            body: JSON.stringify({
                email,
                password
            })
        })
            .then(res => res.json())
            .then(data => handleAuthEvent(data));
    }

    function signup(email, password) {
        return pingServer('/signup', { email, password });
    }

    function login(email, password) {
        return pingServer('/login', { email, password });
    }

    function logout() {
        const prom = pingServer('/logout', {});
        Cookies.remove('loggedIn');
        setLoggedIn(false);
        return prom;
    }

    function resetPassword(email) {
        return pingServer('/password/reset', { email });
    }

    function changePassword() {
        return pingServer('/password/change', {});
    }

    const value = {
        loggedIn,
        signup,
        login,
        logout,
        resetPassword,
        changePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
