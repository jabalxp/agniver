import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      setSuccess('Conta criada com sucesso! Redirecionando...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      let message = 'Erro ao criar conta.';
      if (err.code === 'auth/email-already-in-use') message = 'O e-mail já está em uso.';
      if (err.code === 'auth/weak-password') message = 'A senha é muito fraca.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background pt-20">
      <div className="max-w-md w-full glass-border p-8 bg-white/5 backdrop-blur-xl">
        <h2 className="font-space text-4xl uppercase text-lime-goro mb-8 font-bold text-center">Registro</h2>
        {error && <p className="text-error mb-4 text-center text-sm font-bold uppercase">{error}</p>}
        {success && <p className="text-lime-goro mb-4 text-center text-sm font-bold uppercase">{success}</p>}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Nome Completo</label>
            <input 
              type="text" 
              className="w-full bg-[#121212] border border-white/20 px-4 py-3 text-white focus:border-lime-goro focus:ring-0 transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            Criar Conta
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-on-surface-variant">
          Já tem uma conta? <Link to="/login" className="text-lime-goro hover:underline">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
