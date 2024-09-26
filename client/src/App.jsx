import { useEffect, useState } from 'react';
import axios from "axios";
import Header from './components/Header';
import Home from './components/Home';
import Modal from './components/Modal';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';

const App = () => {
  const [user, setUser] = useState(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const fetchUser = async () => {
    const response = await axios.get("http://localhost:8080/api/users/current", { withCredentials: true }); 
    setUser(response.data);
    console.log("Current user:", response.data)
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className='h-screen overflow-hidden'>
        <Header user={user} onSignInOpen={() => setIsSignInOpen(true)} />
        <div className='h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]'>
          <Home onSignUpOpen={() => setIsSignUpOpen(true)} />
        </div>
      </div>

      <Modal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)}>
        <SignInForm onClose={() => setIsSignInOpen(false)} />
      </Modal>

      <Modal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)}>
        <SignUpForm onClose={() => setIsSignUpOpen(false)} />
      </Modal>
    </>
  );
};

export default App;
