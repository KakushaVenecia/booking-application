import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function Layout({ children }) {
  const { user } = useAuth();

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/';
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Link href="/dashboard" style={styles.link}>Dashboard</Link>
          <Link href="/availability" style={styles.link}>Availability</Link>
          <Link href="/calendar" style={styles.link}>Calendar</Link>
        </div>
        <div style={styles.navRight}>
          {user ? (
            <>
              <span style={styles.greeting}>Hello, {user.username} 👋</span>
              <button onClick={handleLogout} style={styles.button}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-blue-600 hover:underline" >Login</Link>
              <Link href="/auth/register" className="text-blue-600 hover:underline" >Register</Link>
            </>
          )}
        </div>
      </nav>
      <main style={styles.main}>{children}</main>
    </>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc',
  },
  navLeft: {
    display: 'flex',
    gap: '1rem',
  },
  navRight: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#0070f3',
    fontWeight: '500',
  },
  greeting: {
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    background: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  main: {
    padding: '2rem',
  },
};
