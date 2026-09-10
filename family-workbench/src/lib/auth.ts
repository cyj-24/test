import { cookies } from "next/headers";
import { prisma } from "./db";
import type { Member, Household } from "@prisma/client";

const SESSION_COOKIE_NAME = "family_session";

export interface SessionData {
  memberId: string;
  householdId: string;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const data = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString()
    );
    return data as SessionData;
  } catch {
    return null;
  }
}

export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies();
  const encoded = Buffer.from(JSON.stringify(data)).toString("base64");

  cookieStore.set(SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentMember(): Promise<
  (Member & { household: Household }) | null
> {
  const session = await getSession();
  if (!session) return null;

  const member = await prisma.member.findUnique({
    where: { id: session.memberId },
    include: { household: true },
  });

  return member;
}

export async function requireAuth(): Promise<Member & { household: Household }> {
  const member = await getCurrentMember();
  if (!member) {
    throw new Error("Unauthorized");
  }
  return member;
}

export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Auth Stub Documentation
 * ========================
 * 
 * This is a simple cookie-based session implementation for MVP purposes.
 * The session data is base64-encoded and stored in an HTTP-only cookie.
 * 
 * To extend this to a real auth system:
 * 
 * 1. For JWT-based auth:
 *    - Replace base64 encoding with signed JWT tokens
 *    - Add token expiration and refresh logic
 *    - Consider using jose or jsonwebtoken libraries
 * 
 * 2. For OAuth (Google, GitHub, etc.):
 *    - Install next-auth: npm install next-auth
 *    - Configure OAuth providers in app/api/auth/[...nextauth]/route.ts
 *    - Link OAuth accounts to Member records
 * 
 * 3. For password-based auth:
 *    - Add passwordHash field to Member model
 *    - Use bcrypt for password hashing
 *    - Add login/register API routes
 * 
 * 4. Security improvements:
 *    - Use signed/encrypted cookies (iron-session)
 *    - Add CSRF protection
 *    - Implement rate limiting
 *    - Add session invalidation on password change
 */
