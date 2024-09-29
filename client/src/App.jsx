import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Home from './components/Home';
import Modal from './components/Modal';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Inventory from './components/Inventory';
import ButtonGradient from './assets/ButtonGradient';
import Inbound from './components/Inbound';
import Outbound from './components/Outbound';
import UserManagement from './components/UserManagement';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const App = () => {
  const [user, setUser] = useState(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:8080/api/users/current');
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      if (error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
      }
    }
  };

  const handleSignIn = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', { username, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsSignInOpen(false);
      const decodedToken = jwtDecode(token);
      console.log('Login successful, token expires at:', decodedToken.exp);
      scheduleAutoLogout(decodedToken.exp);
    } catch (error) {
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const scheduleAutoLogout = (exp) => {
    const expirationTime = exp * 1000 - Date.now();
    if (expirationTime > 0) {
      console.log(`Scheduling auto logout in ${expirationTime / 1000} seconds.`);
      setTimeout(() => {
        handleSignOut();
        alert('Session expired. Please log in again.');
      }, expirationTime);
    }
  };

  const handleSignUp = async (username, password, role) => {
    try {
      await axios.post('http://localhost:8080/api/users', { username, password, role });
      setIsSignUpOpen(false);
      handleSignIn(username, password);
    } catch (error) {
      alert('Error signing up. Please try again.');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      const decodedToken = jwtDecode(token);
      scheduleAutoLogout(decodedToken.exp);
    } else {
      fetchUser();
    }
  }, []);

  return (
    <>
      <div className="h-screen overflow-hidden">
        <Header user={user} onSignInOpen={() => setIsSignInOpen(true)} onSignOut={handleSignOut} />
        <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]">
          <Routes>
            <Route path='/' element={<Home onSignUpOpen={() => setIsSignUpOpen(true)} />} />
            <Route path='/inventory' element={<Inventory />} />
            <Route path='/inbound' element={<Inbound />} />
            <Route path='/outbound' element={<Outbound />} />
            <Route path='/users' element={<UserManagement />} />
          </Routes>
        </div>
      </div>
      <ButtonGradient />

      <Modal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)}>
        <SignInForm onSignIn={handleSignIn} onClose={() => setIsSignInOpen(false)} />
      </Modal>

      <Modal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)}>
        <SignUpForm onSignUp={handleSignUp} onClose={() => setIsSignUpOpen(false)} />
      </Modal>
    </>
  );
};

export default App;
