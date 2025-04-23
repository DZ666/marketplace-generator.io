import React, { useState } from 'react';
import styles from './AuthForm.module.scss';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const { login, register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      let success = false;

      if (mode === 'login') {
        success = await login(email, password);
      } else {
        // Валидация формы
        if (!name.trim()) {
          setFormError('Name is required');
          return;
        }
        success = await register(name, email, password);
      }

      if (success) {
        // Authentication successful, redirect to admin panel
        router.push('/admin');
      } else {
        // Authentication failed, display an error message
        setFormError(error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Error during authentication:', err);
      setFormError('An error occurred during authentication. Please try again.');
    }
  };

return (
  <div className={styles.container}>
    <h2 className={styles.heading}>{mode === 'login' ? 'Login' : 'Register'}</h2>
    <form onSubmit={handleSubmit} className={styles.form}>
      {formError && (
        <div className={styles.error}>{formError}</div>
      )}
      {mode === 'register' && (
        <div className={styles.inputWrapper}>
          <label htmlFor="name" className={styles.label}>Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </div>
      )}
      <div className={styles.inputWrapper}>
        <label htmlFor="email" className={styles.label}>Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.inputWrapper}>
        <label htmlFor="password" className={styles.label}>Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <button 
        type="submit" 
        className={styles.button}
        disabled={loading}
      >
        {loading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Register')}
      </button>
    </form>
  </div>
);
};

export default AuthForm;