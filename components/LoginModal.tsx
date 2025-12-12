import React, { useState } from 'react';
import { ToonButton } from './ToonButton';
import { useLanguage } from '../context/LanguageContext';
import { X, KeyRound, Lock, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t('login.error_fields'));
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(username, password);
      // Reset form on success
      setUsername('');
      setPassword('');
      setError('');
      onClose();
    } catch (err: any) {
      setError(t('login.error_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 animate-in fade-in zoom-in duration-200">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors border-2 border-transparent hover:border-black"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-toon-yellow border-2 border-black rounded-full mb-4">
            <KeyRound size={32} />
          </div>
          <h2 className="text-3xl font-black">{t('login.title')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-black text-lg mb-2 flex items-center gap-2">
                <User size={18} /> {t('login.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-4 border-black rounded-xl p-3 font-bold text-xl focus:outline-none focus:shadow-toon transition-shadow disabled:bg-gray-100"
              placeholder="e.g. account"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <label className="block font-black text-lg mb-2 flex items-center gap-2">
              <Lock size={18} /> {t('login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-4 border-black rounded-xl p-3 font-bold text-xl focus:outline-none focus:shadow-toon transition-shadow disabled:bg-gray-100"
              placeholder="••••••"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-toon-red text-white font-bold p-2 border-2 border-black rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}
          
          <ToonButton type="submit" className="w-full py-3 mt-2" isLoading={isLoading}>
            {isLoading ? t('login.unlocking') : t('login.unlock')}
          </ToonButton>
        </form>
      </div>
    </div>
  );
};