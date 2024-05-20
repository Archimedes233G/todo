// src/components/Auth.js

import React, { useState } from 'react';
import AuthForm from './AuthForm';
import supabase from '../supabase'; // Import supabase

const Auth = ({ onAuth }) => {
  const [authType, setAuthType] = useState('login');

  const handleAuth = async (email, password) => {
    if (authType === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Error logging in:', error.message);
      } else {
        onAuth();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Error signing up:', error.message);
      } else {
        onAuth();
      }
    }
  };

  return (
    <div className="auth-container">
      <AuthForm type={authType} onSubmit={handleAuth} />
      <div className="auth-buttons">
        <button
          type="button"
          onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
        >
          Switch to {authType === 'login' ? 'Sign Up' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
