// File: components/MatchAuthentication.tsx
import React, { useState } from 'react';

interface MatchAuthenticationProps {
  isAuthenticated: boolean;
  authenticate: (password: string) => void;
}

const MatchAuthentication: React.FC<MatchAuthenticationProps> = ({ isAuthenticated, authenticate }) => {
  const [password, setPassword] = useState('');

  return (
    <div style={{ position: 'relative' }}>
      <h2>관리자 로그인</h2>
      <input
        type="password"
        placeholder="관리자 비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => authenticate(password)}>로그인</button>
    </div>
  );
};

export default MatchAuthentication;
