import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../reducers/authSlice';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon , EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {

  // const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // debug
      console.log('Respone Status:', response.status);

      if (!response.ok) {
        throw new Error('Login failed with status: ' + response.status);
      }

      const data = await response.json();
      console.log("Respone Data:", data);

      if (data.token) {
        console.log("Received token: ", data.token);
        const decoded = jwtDecode(data.token);
        dispatch(loginSuccess(decoded));
        if (decoded.roles.includes('admin')) {
          navigate('/admin-dashboard');
        } else if (decoded.roles.includes('customer')) {
          navigate('/customer-dashboard');
        } else if (decoded.roles.includes('staff')) {
          navigate('/staff-dashboard');
        }

        localStorage.setItem('token', data.token);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-900">
      <div className="w-full max-w-md p-8 bg-slate-200 shadow-md rounded">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
             /* type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your username"
              autoComplete="username" */

              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 pr-10"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot Password?</Link>
            {/* <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot Password?</a> */}
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">Login</button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-700">Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login