import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext'; //

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuth(); // get setUser from context

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      const userRes = await fetch('http://localhost:5000/api/users/me', {
        credentials: 'include',
      });

      const userData = await userRes.json();
      if (!userRes.ok) throw new Error(userData.message || 'Failed to fetch user');

      setUser(userData.user); // ✅ update context
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 space-y-4 bg-white rounded-lg shadow">
        <Image src="/cwj.png" alt="Logo" width={1306} height={826} priority />
        <h1 className="text-xl font-semibold text-center text-gray-700">Login to Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="w-full py-2 mt-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 text-sm"
          >
            Login
          </button>
          
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
           <p className="text-xs text-center text-gray-500">
          Forgot Password?{' '}
          <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
            Reset Password 
          </Link>
           </p>
        </form>
        <p className="text-xs text-center text-gray-500">
          Don’t have an account?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
