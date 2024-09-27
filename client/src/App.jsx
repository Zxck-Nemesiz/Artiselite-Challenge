import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Home from './components/Home';
import Modal from './components/Modal';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [user, setUser] = useState(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const navigate = useNavigate();

  // Set Axios Interceptor once on initial render
  useEffect(() => {
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }, []);

  // Function to fetch the current logged-in user
  const fetchUser = async () => {
    const token = localStorage.getItem('token'); 
  
    if (!token) {
      console.log('No token found, user not logged in');
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:8080/api/users/current', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data && response.data.user) {
        setUser(response.data.user); // Set the current user
      } else {
        console.log('No user data in response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response && error.response.status === 403) {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
      }
    }
  };
  

  // Function to handle sign-in
  const handleSignIn = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token); // Store the token in localStorage
      setUser(response.data.user); // Set user immediately after login
      setIsSignInOpen(false); // Close the modal
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  // Function to handle sign-out
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // Function to handle sign-up
  const handleSignUp = async (username, password, role) => {
    try {
      await axios.post('http://localhost:8080/api/users', { username, password, role });
      setIsSignUpOpen(false);
      handleSignIn(username, password);
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Error signing up. Please try again.');
    }
  };

  // Fetch the user on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(); // Fetch the user on initial load if token exists
    }
  }, []);
  

  return (
    <>
      <div className="h-screen overflow-hidden">
        <Header user={user} onSignInOpen={() => setIsSignInOpen(true)} onSignOut={handleSignOut} />
        <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]">
          <Home onSignUpOpen={() => setIsSignUpOpen(true)} />
        </div>
      </div>

      {/* Sign-In Modal */}
      <Modal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)}>
        <SignInForm onSignIn={handleSignIn} onClose={() => setIsSignInOpen(false)} />
      </Modal>

      {/* Sign-Up Modal */}
      <Modal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)}>
        <SignUpForm onSignUp={handleSignUp} onClose={() => setIsSignUpOpen(false)} />
      </Modal>
    </>
  );
};

export default App;
