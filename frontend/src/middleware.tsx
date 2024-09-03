import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default async function middleware(req: NextRequest) {
    const protectedRoutes = ['/home',  '/error/unverified'];
    const unprotectedRoutes = ['/login', '/register'];

    const currentPath = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    const isUnprotectedRoute = unprotectedRoutes.some(route => currentPath.startsWith(route));

    if (isProtectedRoute && !isUnprotectedRoute) {
        const cookie = cookies().get('session')?.value;
        if (!cookie) {
            console.log('salut')
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};