import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('user', JSON.stringify({ name: user.displayName, email: user.email }));
      navigate('/');
      window.location.reload();
    } catch (err) {
      let message = 'Erro ao fazer login.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'E-mail ou senha inválidos.';
      }
      setError(message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem('user', JSON.stringify({ name: user.displayName, email: user.email }));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError('Erro ao entrar com Google.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background pt-20">
      <div className="max-w-md w-full glass-border p-8 bg-white/5 backdrop-blur-xl">
        <h2 className="font-space text-4xl uppercase text-lime-goro mb-8 font-bold text-center">Login</h2>
        {error && <p className="text-error mb-4 text-center text-sm font-bold uppercase">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">E-mail</label>
            <input 
              type="email" 
              className="w-full bg-[#121212] border border-white/20 px-4 py-3 text-white focus:border-lime-goro focus:ring-0 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Senha</label>
            <input 
              type="password" 
              className="w-full bg-[#121212] border border-white/20 px-4 py-3 text-white focus:border-lime-goro focus:ring-0 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-lime-goro text-black font-bold py-4 uppercase glow-lime hover:scale-[1.02] active:scale-95 transition-all">
            Entrar
          </button>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-on-surface-variant">Ou continue com</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white/5 border border-white/20 text-white font-bold py-4 uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-on-surface-variant">
          Não tem uma conta? <Link to="/register" className="text-lime-goro hover:underline">Registre-se agora</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
