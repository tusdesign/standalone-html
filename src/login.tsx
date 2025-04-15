import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './hooks/useAuth';
import { getAuthInfoFromCookie } from './lib/cookie';

export default function Login() {
  const { authInfo, setAuthInfo } = useAuth();

  // Initialize mobile state with value from AuthContext (cookie-based)
  const [mobile, setPhone] = useState<string>(authInfo?.mobile || ''); // Default to empty string if not set

  useEffect(() => {
    if (authInfo?.mobile) {
      setPhone(authInfo.mobile);
    }
  }, [authInfo]);

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!mobile.match(/^\d{11}$/)) {
      alert('Enter a valid 11-digit phone number');
      return;
    }

    // Simulate sending OTP
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/public/otps`,
        {
          mobile,
        },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        setIsOtpSent(true);
      });
  };

  const handleLogin = async () => {
    let msg = '';
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/public/otps`,
        {
          code: otp,
          mobile,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        const authInfo = getAuthInfoFromCookie();
        setAuthInfo(authInfo);
        // The backend sets the cookie, and you navigate
        navigate('/visitor/appointment'); // Navigate to the homepage/dashboard
        return;
      } else {
        console.error('Unexpected response status:', response.status);
        alert('Login failed. Please try again.');
        navigate('/login'); // Redirect to login page in case of error
      }
    } catch (error: unknown) {
      // Type assertion to ensure error is an AxiosError
      if (axios.isAxiosError(error)) {
        // AxiosError handling
        if (error.response) {
          // Backend error response (non-2xx status code)
          if (error.response.status === 401) {
            // Invalid OTP
            msg = 'Invalid OTP. Please try again.';
          } else {
            console.error('Backend error:', error.response.data);
          }
        } else if (error.request) {
          // No response received from the server
          console.error('No response from server:', error.request);
        } else {
          // Error setting up the request
          console.error('Error setting up the request:', error.message);
        }
      } else {
        // General error (not an AxiosError)
        console.error('Unexpected error:', error);
      }
      if (!msg) {
        msg = 'System error. Please try again.';
      }
      alert(msg);
      // Redirect to the login page for all errors
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-80 space-y-4">
        <h2 className="text-2xl font-bold text-center">OTP Login</h2>

        <input
          type="text"
          placeholder="Phone Number"
          value={mobile || '12345678901'}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button onClick={handleSendOtp} className="w-full bg-blue-500 text-white p-2 rounded">
          Send OTP
        </button>

        {isOtpSent && (
          <div className="space-y-4 pt-2">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button onClick={handleLogin} className="w-full bg-green-500 text-white p-2 rounded">
              Verify & Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
