import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import UpdateProfile from './components/UpdateProfile';
import Signup from './components/Signup';
import SignupAuth from './components/SignupAuth';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import ResetPasswordAuth from './components/ResetPasswordAuth';
import EnterNewPassword from './components/EnterNewPassword';
import NotFound from './components/NotFound';

function App() {
    return (
        <AuthProvider>
            <Container className='d-flex align-itmes-center justify-content-center' style={{ minHeight: '100vh' }}>
                <div className='w-100' style={{ maxWidth: '400px' }}>
                    <Router>
                        <AuthProvider>
                            <Routes>
                                <Route path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                <Route path='/update-profile' element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
                                <Route path='/signup'>
                                    <Route path='' element={<Signup />} />
                                    <Route path='auth/:emailAuthStr' element={<SignupAuth />} />
                                </Route>
                                <Route path='/login' element={<Login />} />
                                <Route path='/forgot-password' element={<ResetPassword />} />
                                <Route path='/password'>
                                    <Route path='reset/auth/:resetPasswordAuthStr' element={<ResetPasswordAuth />} />
                                    <Route path='reset/enter-new-password' element={<EnterNewPassword />} />
                                </Route>
                                <Route path='/*' element={<NotFound />} />
                            </Routes>
                        </AuthProvider>
                    </Router>
                </div>
            </Container>
        </AuthProvider>
    );
}

export default App;