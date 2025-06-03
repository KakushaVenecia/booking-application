import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'
import Link from 'next/link';

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      router.push('/auth/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 space-y-4 bg-white rounded-lg shadow">
        <Image src="/cwj.png" alt="" 
                        width={1306}
                      height={826}/>
        <h1 className="text-xl font-semibold text-center text-gray-700">Create Your Account</h1>
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
            name="username"
            placeholder="Username"
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="w-full py-2 mt-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 text-sm"
          >
            Register
          </button>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        </form>
        <p className="text-xs text-center text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline" >Log in</Link>
        </p>
      </div>
    </div>
  );
}
