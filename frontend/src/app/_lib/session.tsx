'use server'

import {cookies} from "next/headers";
import {JWTPayload, jwtVerify, SignJWT} from "jose";
import {redirect} from "next/navigation";

const key = new TextEncoder().encode(process.env.SECRET_KEY);

const cookieConfig = {
    name: 'session',
    options: {httpOnly: true, secure: true, sameSite: 'lax', path: '/'},
    duration: 24 * 60 * 60 * 1000
}

export async function encrypt(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('1day')
        .sign(key);
}

export async function decrypt(session: any) {
    try {
        const {payload} = await jwtVerify(session, key, {
            algorithms: ['HS256']
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function createSession(userId: number, email: string, isVerified: boolean, token: string, refreshToken: string): Promise<void> {
    const expires = new Date(Date.now() + cookieConfig.duration);
    const session = await encrypt({userId, email, isVerified, token, refreshToken, expires});
    cookies().set(cookieConfig.name, session, {expires, httpOnly: true});
}

export async function getSession() {
    const cookie = cookies().get('session')?.value;
    return await decrypt(cookie);
}

export async function verifySession(): Promise<{ userData: JWTPayload }> {
    const cookie = cookies().get(cookieConfig.name)?.value;
    const session = await decrypt(cookie);
    if (!session || !session.token || !session.refreshToken) return redirect('/');

    return {userData: session};
}

export async function deleteSession(): Promise<void> {
    cookies().delete(cookieConfig.name);
    redirect('/auth/login');
}
