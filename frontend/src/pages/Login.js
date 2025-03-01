import React from 'react';
import { loadFull } from 'tsparticles';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    console.log('Initializing tsparticles engine...');
    await loadFull(engine).then(() =>
      console.log('Engine loaded successfully')
    );
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      console.error('Login response or credential is missing');
      return;
    }

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5555';
    try {
      const res = await fetch(`${apiUrl}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) {
        throw new Error(`Login error: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.authToken) {
        localStorage.setItem('authToken', data.authToken);
        navigate('/dashboard');
      } else {
        console.error('Auth token missing in response');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        background: '#0d0d0d',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: ['#ff007f', '#00d8ff', '#f0db4f'] }, // Illuminating dots in pink, cyan, and yellow
            shape: { type: 'circle' },
            opacity: {
              value: 0.8,
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.3,
                sync: false,
              },
            },
            size: {
              value: 5,
              random: { enable: true, minimumValue: 2 },
              animation: {
                enable: true,
                speed: 3,
                minimumValue: 1,
                sync: false,
              },
            },
            links: {
              enable: true,
              distance: 150,
              color: '#ffffff',
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: false,
              straight: false,
              outModes: { default: 'bounce' },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' }, // Repel particles on hover
              onClick: { enable: true, mode: 'push' }, // Add particles on click
              resize: true,
            },
            modes: {
              repulse: { distance: 100, duration: 0.5 },
              push: { quantity: 4 },
            },
          },
          retinaDetect: true,
        }}
      />

      {/* Login Card */}
      <div style={styles.loginCard}>
        <h1 style={styles.title}>Welcome to TaskFlow</h1>
        <p style={styles.subtitle}>Organize your tasks like never before</p>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.error('Login Failed');
          }}
        />
      </div>
    </div>
  );
};

// Inline styles for the card
const styles = {
  loginCard: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '30px',
    background: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '15px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '10px',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    marginBottom: '20px',
    fontSize: '16px',
    color: '#555',
  },
};

export default Login;
