import { useEffect } from 'react';
import './App.css';
import axios from "axios";

function App() {
  const fetchAPI = async () => {
    const response = await axios.get("https://localhost:8080");
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
}

export default App
