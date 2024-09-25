import { useEffect } from 'react';
import axios from "axios";
import Button from './components/Button';
import ButtonGradient from './assets/ButtonGradient';
import Header from './components/Header';

const App = () => {
  const fetchAPI = async () => {
    const response = await axios.get("https://localhost:8080");
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>      
      <div className='pt-[4rem] lg:pt-[5rem] overflow-hidden'>
       <Header />
      </div>
      <ButtonGradient />
    </>
    
  )
}

export default App
