import React from 'react';
import Button from './Button';

const SignUpForm = ({ onClose }) => {
  return (
    <form className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full p-3 border border-n-6 rounded-md"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border border-n-6 rounded-md"
      />
      <Button type="submit" className="mt-4 w-full">
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm;
