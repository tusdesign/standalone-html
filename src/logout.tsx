// components/LogoutButton.tsx
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove('access_token');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">
      Logout
    </button>
  );
}
