'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Loader from '@/components/Loader';
import { UserContext } from '@/contexts/UserContext';
import { ErrorResponse, UserResponse } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, userDetails } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if(userDetails) {
        router.replace(userDetails.userType == 'user' ? `/?user=${encodeURIComponent(userDetails.userName)}` : '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        setIsLoading(true);
        const response: AxiosResponse<UserResponse> = await axios.post('/api/authenticate-user', {
          userEmail: email,
          password,
        });

        setIsLoading(false);
        const user = response.data.data;
        setUser(response.data.data);
        console.log('Encoded URL:', `/?user=${encodeURIComponent(user.userName)}`);
        router.replace(user.userType == 'user' ? `/?user=${encodeURIComponent(user.userName)}` : '/');
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        const message = err.response?.data.message || 'Something went wrong';
        toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 flex items-center text-black justify-center px-4'>
      {isLoading && <Loader />}
      <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl'>
        <h2 className='text-3xl font-bold text-center text-blue-600 mb-8'>
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-5'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@example.com'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
              required
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 cursor-pointer'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
