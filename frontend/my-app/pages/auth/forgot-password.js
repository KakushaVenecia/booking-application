import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch('http://localhost:5000/api/users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 space-y-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-center mb-2">
          <Image src="/cwj.png" alt="Logo" width={100} height={60} />
        </div>
        <h1 className="text-lg font-semibold text-center text-gray-700">Forgot Password</h1>
        <p className="text-sm text-center text-gray-500">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          {message && (
            <p className={`text-xs text-center ${message.includes('error') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </form>
        
        <p className="text-xs text-center text-gray-500">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}