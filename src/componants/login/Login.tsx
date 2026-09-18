import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import styles from './Login.module.css';

export const LoginComponent: React.FC = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useLogin();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    if (!userName.trim() || !password.trim()) {
      setValidationError('Username and password are required.');
      return;
    }

    mutate(
      { userName, password },
      {
        onSuccess: () => {
          navigate('/dashboard', { replace: true });
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Account Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            id="username"
            type="text"
            className={styles.input}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isPending}
            autoComplete="username"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            autoComplete="current-password"
            required
          />
        </div>

        {validationError && <p className={styles.errorText} role="alert">{validationError}</p>}
        {isError && <p className={styles.errorText} role="alert">{error?.message || 'Login failed.'}</p>}

        <button type="submit" className={styles.submitButton} disabled={isPending}>
          {isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
