import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, just pass through all requests
  // Supabase session management happens on the client side
  return NextResponse.next({
    request,
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

