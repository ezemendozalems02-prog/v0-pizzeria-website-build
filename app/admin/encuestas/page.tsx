import { redirect } from 'next/navigation'

// Encuestas has moved to its own standalone panel at /encuestas
export default function EncuestasRedirect() {
  redirect('/encuestas')
}
