# VetManager Pro — Prototipo

Sistema de gestión de pacientes veterinarios. Prototipo funcional con datos de demostración.

## Credenciales de acceso
- **Email:** vet@example.com  
- **Contraseña:** admin

## Cómo publicar en Vercel

1. Crea una cuenta en [vercel.com](https://vercel.com) (gratis)
2. Instala Vercel CLI: `npm install -g vercel`
3. En esta carpeta, corre: `vercel`
4. Sigue los pasos en pantalla
5. En "Build Command" usa: `npm run build`
6. En "Output Directory" usa: `dist`

### O desde la interfaz web:
1. Sube esta carpeta a un repositorio de GitHub
2. En Vercel → "Import Project" → selecciona el repo
3. Framework: **Vite**
4. Deploy

## Stack
- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- Radix UI + shadcn
- Recharts
- react-router 7
- date-fns
- Datos en localStorage (prototipo)

## Notas del prototipo
- Todos los datos son de demostración y se guardan en el navegador (localStorage)
- El envío de WhatsApp abre wa.me con mensaje prellenado
- No hay backend real — es un prototipo visual completo
