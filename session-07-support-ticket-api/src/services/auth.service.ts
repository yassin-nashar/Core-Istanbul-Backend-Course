import { Prisma } from "../generated/prisma/client.js";
import { env } from "../config/env.js";
import { signAccessToken } from "../lib/access-token.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { generateRefreshToken, generateTokenFamilyId, hashRefreshToken } from "../lib/refresh-token.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.middleware.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";

const safeUser = { id: true, name: true, email: true, createdAt: true, updatedAt: true } as const;
const sessionMilliseconds = () => env.REFRESH_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
async function lockFamily(tx: Prisma.TransactionClient, familyId: string): Promise<void> {
  await tx.$queryRaw`SELECT 1::int AS "locked" FROM pg_advisory_xact_lock(hashtext(${familyId}))`;
}
async function revokeFamily(familyId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await lockFamily(tx, familyId);
    await tx.refreshToken.updateMany({ where: { familyId, revokedAt: null }, data: { revokedAt: new Date() } });
  });
}

export interface AuthResult { user: { id: string; name: string; email: string; createdAt: Date; updatedAt: Date }; accessToken: string; refreshToken: string; expiresAt: Date }

export const authService = {
  async register(input: RegisterInput) {
    try {
      return await prisma.user.create({ data: { name: input.name, email: input.email, passwordHash: await hashPassword(input.password) }, select: safeUser });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new AppError(409, "An account with this email already exists");
      throw error;
    }
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await verifyPassword(user.passwordHash, input.password))) throw new AppError(401, "Invalid email or password");
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + sessionMilliseconds());
    await prisma.refreshToken.create({ data: { tokenHash: hashRefreshToken(refreshToken), familyId: generateTokenFamilyId(), userId: user.id, expiresAt } });
    const { passwordHash: _passwordHash, ...safe } = user;
    return { user: safe, accessToken: signAccessToken(user.id), refreshToken, expiresAt };
  },

  async refresh(rawToken: string): Promise<AuthResult> {
    const tokenHash = hashRefreshToken(rawToken);
    let outcome;
    try {
      outcome = await prisma.$transaction(async (tx) => {
      const found = await tx.refreshToken.findUnique({ where: { tokenHash }, select: { familyId: true } });
      if (!found) return { kind: "invalid" as const };
      await lockFamily(tx, found.familyId);
      const current = await tx.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });
      if (!current) return { kind: "invalid" as const };
      if (current.consumedAt || current.revokedAt) {
        await tx.refreshToken.updateMany({ where: { familyId: current.familyId, revokedAt: null }, data: { revokedAt: new Date() } });
        return { kind: "invalid" as const };
      }
      if (current.expiresAt <= new Date()) return { kind: "invalid" as const };
      const consumed = await tx.refreshToken.updateMany({ where: { id: current.id, consumedAt: null, revokedAt: null }, data: { consumedAt: new Date() } });
      if (consumed.count !== 1) {
        await tx.refreshToken.updateMany({ where: { familyId: current.familyId, revokedAt: null }, data: { revokedAt: new Date() } });
        return { kind: "invalid" as const };
      }
      const refreshToken = generateRefreshToken();
      const replacement = await tx.refreshToken.create({ data: { tokenHash: hashRefreshToken(refreshToken), familyId: current.familyId, userId: current.userId, expiresAt: current.expiresAt } });
      await tx.refreshToken.update({ where: { id: current.id }, data: { replacedById: replacement.id } });
      const { passwordHash: _passwordHash, ...user } = current.user;
      return { kind: "success" as const, user, refreshToken, expiresAt: current.expiresAt };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        const raced = await prisma.refreshToken.findUnique({ where: { tokenHash }, select: { familyId: true } });
        if (raced) await revokeFamily(raced.familyId);
        throw new AppError(401, "Invalid refresh token");
      }
      throw error;
    }
    if (outcome.kind === "invalid") throw new AppError(401, "Invalid refresh token");
    return { ...outcome, accessToken: signAccessToken(outcome.user.id) };
  },

  async logout(rawToken?: string): Promise<void> {
    if (!rawToken) return;
    const record = await prisma.refreshToken.findUnique({ where: { tokenHash: hashRefreshToken(rawToken) } });
    if (record) await revokeFamily(record.familyId);
  },
};
