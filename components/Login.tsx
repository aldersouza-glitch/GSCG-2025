import React, { useState } from 'react';
import { logoBase64 } from '../data/logoBase64';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'GSCG' && password === 'PMAL2025') {
      onLoginSuccess();
    } else {
      setError('Login ou senha incorretos.');
    }
  };

  return (
    <div className="relative min-h-screen bg-custom-bg flex flex-col items-center justify-center p-4">
        <div 
            className="absolute inset-0 z-0 bg-no-repeat bg-center"
            style={{
                backgroundImage: `url(${logoBase64})`,
                backgroundSize: 'contain',
                opacity: 0.1,
            }}
        ></div>
        <div className="relative z-10 w-full max-w-md">
            <div className="bg-custom-card shadow-2xl rounded-2xl px-8 pt-10 pb-8 mb-4">
                <div className="text-center mb-10">
                    <img src={logoBase64} alt="Logo PMAL" className="w-24 h-24 mx-auto mb-4"/>
                    <h1 className="text-2xl font-bold text-white">
                        DISTRIBUIÇÃO OFICIAIS OPMS
                    </h1>
                    <p className="text-custom-text-secondary mt-2">
                        Acesso Restrito
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-custom-text-secondary text-sm font-bold mb-2" htmlFor="username">
                            Login
                        </label>
                        <input
                            className="shadow-inner bg-gray-700/50 border border-custom-border rounded-lg w-full py-3 px-4 text-custom-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-custom-accent"
                            id="username"
                            type="text"
                            placeholder="Usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-custom-text-secondary text-sm font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <input
                            className="shadow-inner bg-gray-700/50 border border-custom-border rounded-lg w-full py-3 px-4 text-custom-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-custom-accent"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-custom-accent hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
                            type="submit"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
            <p className="text-center text-custom-text-secondary text-xs">
                &copy;{new Date().getFullYear()} PMAL. Todos os direitos reservados.
            </p>
        </div>
    </div>
  );
};

export default Login;