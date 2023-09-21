import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap/esm';
import { Link } from 'react-router-dom';

export default function ResetPasswordAuth() {
    const { resetPasswordAuthStr } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setError('');

        fetch('/password/reset/auth', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                resetPasswordAuthStr
            })
        }).then(async (res) => {
            const resJson = await res.json();
            if (resJson.success === false) {
                setError(resJson.message || 'Error resetting password')
            }
        }).catch(err => {
            setError(err.message || 'Error resetting password');
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {loading
                ? <Spinner />
                : error
                    ? <div>{error}</div>
                    : <div>
                        <h2>Your password was resest successfully</h2>
                        <Link to='/login'>Click Here To Login</Link>
                    </div>
            }
        </div>
    )
}
