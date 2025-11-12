/**
 * OAuth Authentication Utility
 * Handles Google, Facebook, and Twitter OAuth flows
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
const TWITTER_CLIENT_ID = import.meta.env.VITE_TWITTER_CLIENT_ID;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Initialize Google OAuth
 */
export const initGoogleOAuth = () => {
  return new Promise((resolve, reject) => {
    // Load Google Identity Services library
    if (window.google) {
      resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

/**
 * Google OAuth Login
 */
export const loginWithGoogle = async () => {
  try {
    await initGoogleOAuth();
    
    return new Promise((resolve, reject) => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            // Send the credential to backend
            const result = await fetch(`${API_BASE_URL}/auth/google/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id_token: response.credential,
              }),
            });

            const data = await result.json();
            
            if (result.ok) {
              resolve(data);
            } else {
              reject(new Error(data.error || 'Google login failed'));
            }
          } catch (error) {
            reject(error);
          }
        },
      });

      // Display the One Tap prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { theme: 'outline', size: 'large' }
          );
        }
      });
    });
  } catch (error) {
    throw new Error('Failed to initialize Google OAuth: ' + error.message);
  }
};

/**
 * Initialize Facebook SDK
 */
export const initFacebookSDK = () => {
  return new Promise((resolve) => {
    // Check if SDK is already loaded
    if (window.FB) {
      resolve(window.FB);
      return;
    }

    // Load Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v13.0'
      });
      resolve(window.FB);
    };

    // Load SDK script
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
};

/**
 * Facebook OAuth Login
 */
export const loginWithFacebook = async () => {
  try {
    const FB = await initFacebookSDK();

    return new Promise((resolve, reject) => {
      FB.login((response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          
          // Send access token to backend
          fetch(`${API_BASE_URL}/auth/facebook/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: accessToken,
            }),
          })
            .then(res => res.json())
            .then(data => {
              if (data.access && data.refresh) {
                resolve(data);
              } else {
                reject(new Error('Facebook login failed'));
              }
            })
            .catch(reject);
        } else {
          reject(new Error('Facebook login cancelled'));
        }
      }, {scope: 'public_profile,email'});
    });
  } catch (error) {
    throw new Error('Failed to initialize Facebook OAuth: ' + error.message);
  }
};

/**
 * Twitter OAuth Login
 * Note: Twitter OAuth 2.0 requires PKCE flow, which is more complex
 */
export const loginWithTwitter = async () => {
  try {
    // Generate code verifier and challenge for PKCE
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Store code verifier in sessionStorage
    sessionStorage.setItem('twitter_code_verifier', codeVerifier);
    
    // Build authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: TWITTER_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/twitter/callback`,
      scope: 'tweet.read users.read',
      state: generateRandomString(16),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
    
    // Redirect to Twitter authorization
    window.location.href = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  } catch (error) {
    throw new Error('Failed to initialize Twitter OAuth: ' + error.message);
  }
};

/**
 * Handle Twitter OAuth callback
 */
export const handleTwitterCallback = async (code, state) => {
  try {
    const codeVerifier = sessionStorage.getItem('twitter_code_verifier');
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }
    
    // Send code to backend
    const response = await fetch(`${API_BASE_URL}/auth/twitter/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
        redirect_uri: `${window.location.origin}/auth/twitter/callback`,
      }),
    });
    
    const data = await response.json();
    
    // Clean up
    sessionStorage.removeItem('twitter_code_verifier');
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Twitter login failed');
    }
  } catch (error) {
    throw new Error('Twitter callback failed: ' + error.message);
  }
};

// Helper functions
function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  
  return result;
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to base64url
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export default {
  loginWithGoogle,
  loginWithFacebook,
  loginWithTwitter,
  handleTwitterCallback,
};
