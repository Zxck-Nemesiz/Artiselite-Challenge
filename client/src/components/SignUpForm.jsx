import { useState } from 'react';

const SignUpForm = ({ onSignUp, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('operator'); // Example: Default role is 'operator'

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp(username, password, role); // Call the onSignUp function passed from App.jsx
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">Sign Up</h2>
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
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-3 border border-n-6 rounded-md"
      >
        <option value="operator">Operator</option>
        <option value="warehouse_manager">Warehouse Manager</option>
      </select>
      <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
