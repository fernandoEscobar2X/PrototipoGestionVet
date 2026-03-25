import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { PawPrint, Lock, Mail, ArrowRight, Stethoscope } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate network delay for realism
    setTimeout(() => {
      if (email === 'vet@example.com' && password === 'admin') {
        login();
        navigate('/');
      } else {
        setError('Credenciales inválidas. Usa: vet@example.com / admin');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12 bg-white z-10 shadow-xl lg:shadow-none">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-6 text-teal-600">
              <div className="p-2 bg-teal-50 rounded-lg">
                <PawPrint className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">VetManager Pro</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Bienvenido de nuevo
            </h1>
            <p className="text-slate-500 text-lg">
              Accede a tu panel de control veterinario
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Correo Profesional
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl leading-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  placeholder="nombre@clinica.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl leading-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-2 py-3.5 px-4 
                bg-slate-900 hover:bg-slate-800 text-white 
                rounded-xl font-bold shadow-lg shadow-slate-900/10 
                hover:shadow-slate-900/20 transition-all transform active:scale-[0.98]
                ${loading ? 'opacity-80 cursor-wait' : ''}
              `}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
             <div className="inline-flex items-center gap-2 text-sm text-slate-500 bg-teal-50 px-4 py-2 rounded-full border border-teal-100 mb-4">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-700">Prototipo de Demostración</span>
             </div>
             <p className="text-xs text-slate-500 mb-3">Haz clic para acceder con las credenciales de prueba:</p>
             <button
               type="button"
               onClick={() => { setEmail('vet@example.com'); setPassword('admin'); }}
               className="inline-flex items-center gap-2 text-sm bg-white border border-teal-200 text-teal-700 px-5 py-2.5 rounded-xl hover:bg-teal-50 transition-all font-medium shadow-sm"
             >
               <Stethoscope className="w-4 h-4" />
               Usar credenciales demo
             </button>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/40 to-slate-900/40 z-10 mix-blend-multiply" />
        <img 
          src="https://images.unsplash.com/photo-1757744140206-07d35af950ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHZldGVyaW5hcmlhbiUyMG9mZmljZXxlbnwxfHx8fDE3NzE2NDY1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Veterinary Clinic" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-20 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent">
          <blockquote className="max-w-lg">
            <p className="text-2xl font-serif italic leading-relaxed mb-6">
              "La medicina veterinaria no se trata solo de curar animales, se trata de cuidar familias."
            </p>
            <footer className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center font-bold">
                DR
              </div>
              <div>
                <cite className="not-italic font-bold block">Dr. Alejandro V.</cite>
                <span className="text-white/60 text-sm">Director Médico</span>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
