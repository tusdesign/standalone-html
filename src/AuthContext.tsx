import { useState } from 'react';
import { AuthContext, AuthInfo, getAuthInfoFromCookie } from './lib/cookie';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(() => getAuthInfoFromCookie());

  return <AuthContext.Provider value={{ authInfo, setAuthInfo }}>{children}</AuthContext.Provider>;
};
