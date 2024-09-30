import { useState } from 'react';

const SignInForm = ({ onSignIn, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">Login Page</h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full p-3 border border-n-6 rounded-md"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border border-n-6 rounded-md"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md">
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
