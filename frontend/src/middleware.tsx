import {NextRequest, NextResponse} from 'next/server';
import {cookies} from "next/headers";
import {decrypt} from "@/app/_lib/session";

export default async function middleware(req: NextRequest) {
    const protectedRoutes = ['/home'];
    const currentPath = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(currentPath);

    if (isProtectedRoute) {
        const cookie = cookies().get('session')?.value;
        const session = await decrypt(cookie);

        if (!session?.userId) {
            return NextResponse.redirect(new URL('/', req.nextUrl));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};