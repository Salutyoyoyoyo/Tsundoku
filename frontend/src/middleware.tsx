import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/_lib/session';

export default async function middleware(req: NextRequest) {
    const protectedRoutes = ['/', '/home'];
    const currentPath = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(currentPath);

    const cookie = req.cookies.get('session');

    if (isProtectedRoute) {
        const cookieValue = cookie?.value;
        if (!cookieValue) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const session = await decrypt(cookieValue);
        if (!session?.userData) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    if (currentPath === '/login' && cookie?.value) {
        const session = await decrypt(cookie.value);
        console.log(session)
        if (session?.userData) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.ico$).*)'],
};