import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import cookieParser from 'cookie-parser'
 

// const authenticateToken = (token: string) => {
//   const secret = process.env.ACCESS_TOKEN_SECRET;
  
//   if (!secret) {
//     throw new Error('ACCESS_TOKEN_SECRET is not defined');
//   }

//   jwt.verify(token, secret, (err, user) => {
//     if (err) return false;
//   })
//   return true;
// }

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const authTokens = request.cookies.get('accessToken')
  const pathname = new URL(request.url).pathname;

  if (pathname === '/') {
    if (authTokens) {
      return NextResponse.redirect(new URL('/game/poker', request.url))
    }
  }
  if (pathname.startsWith('/game/poker') && !authTokens) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/','/game/poker']
}