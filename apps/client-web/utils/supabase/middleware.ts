import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT REMOVE - refreshes the auth token
  const { data: { user } } = await supabase.auth.getUser()
  let isActiveUser = true

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_status')
      .eq('user_id', user.id)
      .single()

    if (profile?.account_status && profile.account_status !== 'active') {
      isActiveUser = false
      await supabase.auth.signOut()
    }
  }

  // Redirect logic for protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/my-tasks', '/account']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (
    (!user || !isActiveUser) &&
    isProtectedRoute
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing auth routes with active session
  const authRoutes = ['/sign-in', '/sign-up']
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isAuthRoute && user && isActiveUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect signed-in users from homepage to dashboard
  if (request.nextUrl.pathname === '/' && user && isActiveUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}
