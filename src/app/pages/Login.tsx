import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { ArrowRight, Lock, Mail, PawPrint, Stethoscope } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'vet@example.com' && password === 'admin') {
        login();
        navigate('/');
      } else {
        setError('Credenciales invalidas. Usa: vet@example.com / admin');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.12),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <div className="flex w-full flex-col justify-center px-5 py-8 sm:px-8 lg:w-1/2 lg:px-16 lg:py-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/70 backdrop-blur sm:p-6 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
                <Stethoscope className="h-3.5 w-3.5" />
                Demo clinic
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Gestion veterinaria pensada para movil</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Agenda, pacientes, alertas y caja con lectura limpia y accesos rapidos desde recepcion o consulta.
              </p>
            </div>

            <div className="mb-10">
              <div className="inline-flex items-center gap-3 text-teal-600">
                <div className="rounded-2xl bg-teal-50 p-2.5">
                  <PawPrint className="h-8 w-8" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">VetManager Pro</span>
              </div>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Bienvenido de nuevo</h1>
              <p className="mt-3 text-base leading-7 text-slate-500 sm:text-lg">
                Accede a tu panel clinico y mantente al dia con la operacion de la veterinaria.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/70 backdrop-blur sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Correo profesional</label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-teal-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    placeholder="nombre@clinica.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Contrasena</label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-teal-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={[
                  'inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 font-bold text-white shadow-lg shadow-slate-900/10 transition-all active:scale-[0.99] hover:bg-slate-800',
                  loading ? 'cursor-wait opacity-80' : '',
                ].join(' ')}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <span>Iniciar sesion</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="rounded-[24px] border border-teal-100 bg-teal-50 p-4">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-teal-700">
                  <Stethoscope className="h-4 w-4" />
                  Prototipo de demostracion
                </div>
                <p className="mt-2 text-sm text-slate-600">Usa las credenciales de prueba para entrar en un toque.</p>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('vet@example.com');
                    setPassword('admin');
                  }}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-teal-700 transition-all hover:bg-teal-50"
                >
                  <Stethoscope className="h-4 w-4" />
                  Usar credenciales demo
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="relative hidden overflow-hidden rounded-l-[48px] bg-slate-900 lg:block lg:w-1/2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(45,212,191,0.28),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.24),_transparent_32%)]" />
          <img
            src="https://images.unsplash.com/photo-1757744140206-07d35af950ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHZldGVyaW5hcmlhbiUyMG9mZmljZXxlbnwxfHx8fDE3NzE2NDY1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Veterinary clinic"
            className="absolute inset-0 h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/15" />
          <div className="absolute bottom-0 left-0 right-0 p-10 text-white xl:p-14">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <Stethoscope className="h-4 w-4 text-teal-300" />
                Flujo optimizado para recepcion y consulta
              </div>
              <blockquote className="mt-6 text-3xl font-semibold leading-tight xl:text-4xl">
                Gestiona pacientes, agenda y caja con una interfaz clara, rapida y lista para el ritmo real de clinica.
              </blockquote>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
                Un prototipo centrado en operacion diaria: menos friccion, mejor lectura de prioridades y mejores decisiones en movilidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
