import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard'; // Importing Dashboard component

// --- LIVE BACKEND URL ---
const BACKEND_URL = "https://fact-checker-api-8qgm.onrender.com";

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  const handleLogin = async () => {
    try {
      // ✅ Requesting the live Render server
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
      
      alert("Login Successful! 🚀");
      
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true); // Load Dashboard on success
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login Failed! Please check your credentials or allow the server to wake up.");
    }
  };

  // If user is logged in, show the Dashboard
  if (isLoggedIn) {
    return <Dashboard />;
  }

  // If not logged in, show the Login Form
  return (
    <div style={{ 
      padding: '50px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      marginTop: '30px',
      backgroundColor: '#f4f7f6',
      minHeight: '100vh'
    }}>
      <div style={{ 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        backgroundColor: '#fff',
        width: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>🚀 Fact-Checker AI</h2>
        <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '25px' }}>Secure Login to Access Dashboard</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            style={{ 
              padding: '12px', 
              borderRadius: '6px', 
              border: '1px solid #dcdde1',
              fontSize: '14px',
              outline: 'none'
            }}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={{ 
              padding: '12px', 
              borderRadius: '6px', 
              border: '1px solid #dcdde1',
              fontSize: '14px',
              outline: 'none'
            }}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button 
            onClick={handleLogin}
            style={{ 
              padding: '12px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Sign In
          </button>
        </div>

        {/* --- DEMO CREDENTIALS SECTION --- */}
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#2d3436' }}>
            <strong>Demo Credentials</strong><br/>
            Email: <span style={{ color: '#e67e22' }}>vinay@test.com</span><br/>
            Password: <span style={{ color: '#e67e22' }}>123</span>
          </p>
        </div>

        {/* --- SIGNUP GUIDANCE SECTION --- */}
        <div style={{ marginTop: '25px', textAlign: 'left', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <p style={{ fontSize: '12px', color: '#95a5a6', lineHeight: '1.6' }}>
            <strong>Need a new account?</strong><br/>
            Send a POST request using Postman to this endpoint: <br/>
            <code style={{ 
              backgroundColor: '#f1f2f6', 
              padding: '6px', 
              borderRadius: '4px', 
              fontSize: '11px', 
              display: 'block', 
              marginTop: '8px',
              wordBreak: 'break-all',
              color: '#c0392b'
            }}>
              {BACKEND_URL}/api/auth/signup
            </code>
          </p>
        </div>

        <p style={{ fontSize: '11px', color: '#bdc3c7', marginTop: '20px', fontStyle: 'italic' }}>
          *Initial login may take up to 40 seconds as the free-tier server wakes up.
        </p>
      </div>
    </div>
  );
}

export default App;