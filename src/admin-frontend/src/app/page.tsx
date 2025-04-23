"use client";
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import styles from "./page.module.css";

export default function Home() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          Switch to {mode === 'login' ? 'Register' : 'Login'}
        </button>
        <AuthForm mode={mode} />
      </main>
    </div>
  );
}
