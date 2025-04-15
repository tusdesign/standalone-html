import Cookies from 'js-cookie';

import { createContext } from 'react';

export type AuthInfo = {
  mobile: string;
  token: string;
};

export const getAuthInfoFromCookie = (): AuthInfo | null => {
  const raw = Cookies.get('auth_info');
  console.log('raw', raw);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Invalid auth_info cookie', e);
    return null;
  }
};

type AuthContextType = {
  authInfo: AuthInfo | null;
  setAuthInfo: (info: AuthInfo | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
