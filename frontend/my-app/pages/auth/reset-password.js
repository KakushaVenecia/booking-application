import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    
    setIsLoading(true);

    const res = await fetch('http://localhost:5000/api/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);
    setIsLoading(false);

    if (res.ok) {
      setTimeout(() => router.push('/auth/login'), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 space-y-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-center mb-2">
          <Image src="/cwj.png" alt="Logo" width={100} height={60} />
        </div>
        <h1 className="text-lg font-semibold text-center text-gray-700">Reset Password</h1>
        <p className="text-sm text-center text-gray-500">
          Enter your new password below.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            required
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
          {message && (
            <p className={`text-xs text-center ${message.includes('error') || message.includes('not match') ? 'text-red-500' : 'text-green-600'}`}>
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