import React, { useState } from "react";
import { useAuthStore } from "./stores/auth.store";

const AuthPanel = () => {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("1234");

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const clearError = useAuthStore((s) => s.clearError);

  const onLogin = async () => {
    await login({ email, password });
  };

  return (
    <div style={{ padding: 24, display: "grid", gap: 12, maxWidth: 420 }}>
      <h2>Auth (Zustand + TS)</h2>

      {isAuthenticated ? (
        <>
          <div>
            <b>로그인됨</b>
          </div>
          <div>id: {user?.id}</div>
          <div>name: {user?.name}</div>
          <div>email: {user?.email}</div>

          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <>
          <div style={{ display: "grid", gap: 8 }}>
            <input
              type="text"
              value={email}
              placeholder="이메일입력"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="passwrod"
              value={password}
              placeholder="비밀번호입력"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={onLogin} disabled={isLoading}>
            {isLoading ? "로그인중..." : "로그인"}
          </button>

          <div style={{ fontSize: 12, opacity: 0.8 }}>
            테스트 계정: test@test.com / 1234
          </div>
        </>
      )}

      {error && (
        <div style={{ border: "1px solid #ccc", padding: 12 }}>
          <div style={{ marginBottom: 8 }}>에러: {error}</div>
          <button onClick={clearError}>닫기</button>
        </div>
      )}
    </div>
  );
};

export default AuthPanel;
