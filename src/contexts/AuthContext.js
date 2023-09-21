import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    console.log('AuthProvider');

    const [loading, setLoading] = useState(false);
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

        return await new Promise((resolve, reject) => {
            fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method,
                body: JSON.stringify({
                    email,
                    password
                })
            }).then(async (res) => {
                const data = await res.json();
                handleAuthEvent(data);

                if (data.success === false) {
                    reject(data);
                }
                resolve(data);
            }).catch(err => reject(err));
        });
    }

    async function signup(email, password) {
        return await pingServer('/signup', { email, password });
    }

    async function login(email, password) {
        return await pingServer('/login', { email, password });
    }

    async function logout() {
        const prom = pingServer('/logout', {});
        Cookies.remove('loggedIn');
        setLoggedIn(false);
        return await prom;
    }

    async function resetPassword(email) {
        return await pingServer('/password/reset', { email });
    }

    async function changePassword() {
        return await pingServer('/password/change', {});
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
