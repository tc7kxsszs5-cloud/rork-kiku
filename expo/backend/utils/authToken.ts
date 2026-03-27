import { SignJWT, jwtVerify } from 'jose';

export type AuthRole = 'parent' | 'child';

export interface AuthTokenPayload {
  userId: string;
  role: AuthRole;
  parentId?: string;
  childId?: string;
  deviceId?: string;
}

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
};

const ISSUER = 'kiku';
const AUDIENCE = 'kiku-app';
const EXPIRATION = '30d';

export async function signAuthToken(payload: AuthTokenPayload): Promise<string> {
  const secretKey = getSecretKey();

  return new SignJWT({
    role: payload.role,
    parentId: payload.parentId,
    childId: payload.childId,
    deviceId: payload.deviceId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(EXPIRATION)
    .sign(secretKey);
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  if (!token) {
    return null;
  }

  let payload: Awaited<ReturnType<typeof jwtVerify>>['payload'];
  try {
    const secretKey = getSecretKey();
    const verified = await jwtVerify(token, secretKey, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    payload = verified.payload;
  } catch {
    return null;
  }

  if (!payload?.sub || typeof payload.sub !== 'string') {
    return null;
  }

  const role = payload.role;
  if (role !== 'parent' && role !== 'child') {
    return null;
  }

  return {
    userId: payload.sub,
    role,
    parentId: typeof payload.parentId === 'string' ? payload.parentId : undefined,
    childId: typeof payload.childId === 'string' ? payload.childId : undefined,
    deviceId: typeof payload.deviceId === 'string' ? payload.deviceId : undefined,
  };
}
