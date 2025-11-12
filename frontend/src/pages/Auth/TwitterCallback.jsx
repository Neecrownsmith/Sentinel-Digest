import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleTwitterCallback } from '../../utils/oauth';
import { useAuth } from '../../context/AuthContext';

function TwitterCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Twitter authentication was cancelled or failed');
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        const data = await handleTwitterCallback(code, state);
        
        if (data.access && data.refresh) {
          // Store tokens
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          
          // Redirect to home
          navigate('/', { replace: true });
        } else {
          setError('Failed to authenticate with Twitter');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Twitter callback error:', err);
        setError(err.message || 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h1>{loading ? 'Authenticating...' : error ? 'Authentication Failed' : 'Success!'}</h1>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="spinner"></div>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                Completing Twitter authentication...
              </p>
            </div>
          )}

          {error && (
            <div className="auth-error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Redirecting to login page...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TwitterCallback;
