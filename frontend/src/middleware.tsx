import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default async function middleware(req: NextRequest) {
    const protectedRoutes = ['/home',  '/error/unverified'];
    const unprotectedRoutes = ['/auth/login', '/auth/register'];

    const currentPath = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    const isUnprotectedRoute = unprotectedRoutes.some(route => currentPath.startsWith(route));

    if (isProtectedRoute && !isUnprotectedRoute) {
        const cookie = cookies().get('session')?.value;
        if (!cookie) {
            return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};