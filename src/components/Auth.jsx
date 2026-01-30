import { useState } from 'react';
import '../styles/Auth.css';

export function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { authAPI } = await import('../services/auth-api.js');
      const result = isLogin
        ? await authAPI.login(username, password)
        : await authAPI.register(username, password);

      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">✨</div>
          <h1 className="auth-title">Farmasi Beauty</h1>
          <p className="auth-subtitle">Sistema de Inventario</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '⏳ Cargando...' : (isLogin ? '🔓 Entrar' : '✨ Crear Cuenta')}
          </button>

          <div className="auth-info">
            {isLogin ? (
              <p>¿Primera vez? <button type="button" onClick={() => setIsLogin(false)} className="auth-link">Crear una cuenta</button></p>
            ) : (
              <p>¿Ya tienes cuenta? <button type="button" onClick={() => setIsLogin(true)} className="auth-link">Iniciar sesión</button></p>
            )}
          </div>
        </form>

        <div className="auth-footer">
          <p>🔒 Tus datos se guardan localmente en tu navegador</p>
        </div>
      </div>
    </div>
  );
}
