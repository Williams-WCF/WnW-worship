import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../layout/HomeLayout.css';
import '../css/Login.css';
import logo from '../components/images/logo.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@williams.edu')) {
      setError('Please use a @williams.edu email address');
      return;
    }

    const { error: authError } = isSignUp 
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);

    if (authError) {
      setError(authError.message);
    } else {
      if (isSignUp) {
        setError('Check your email to confirm your account!');
      } else {
        navigate('/');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="home-container login-page">
      <div className="home-content">
        <img src={logo} alt="WCF Logo" className="home-logo" />
        <h2 className="home-title">Wednesday Night Worship</h2>
        <p className="home-subtitle">
          {isSignUp ? 'Create your account' : 'Sign in with your Williams email'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleEmailAuth}>
          <input
            className="login-input"
            type="email"
            placeholder="Email (@williams.edu)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="home-btn login">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <button onClick={handleGoogleSignIn} className="home-btn google">
          <span className="google-button-content">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="google-logo"
            />
            Continue with Google
          </span>
        </button>

        <p className="signup-text">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button className="home-btn signup" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Williams Christian Fellowship</p>
      </footer>
    </div>
  );
}

export default Login;