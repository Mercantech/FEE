import NextAuth from "next-auth";
import type { OAuthConfig } from "next-auth/providers";
import type { TokenSet } from "@auth/core/types";
import { decodeJwtPayload } from "@/lib/jwt-payload";

const authHost = "https://auth.mercantec.tech";

interface MercantecProfile {
  sub: string;
  name?: string;
  email?: string;
  role?: string | string[];
}

function normalizeRoles(role: string | string[] | undefined): string[] {
  if (role == null) return [];
  return Array.isArray(role) ? role : [role];
}

function mercantecProvider(): OAuthConfig<MercantecProfile> {
  return {
    id: "mercantec",
    name: "Mercantec",
    type: "oauth",
    authorization: {
      url: `${authHost}/oauth/authorize`,
      params: {
        response_type: "code",
        scope: "",
      },
    },
    token: `${authHost}/oauth/token`,
    userinfo: {
      url: `${authHost}/health`,
      async request(context: { tokens: TokenSet }) {
        const { tokens } = context;
        const accessToken = tokens.access_token;
        if (typeof accessToken !== "string") {
          throw new Error("Mercantec Auth: mangler access_token");
        }
        const payload = decodeJwtPayload(accessToken) as unknown as MercantecProfile;
        return {
          sub: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        };
      },
    },
    clientId: process.env.MERCANTEC_CLIENT_ID,
    clientSecret: process.env.MERCANTEC_CLIENT_SECRET || undefined,
    checks: ["pkce", "state"],
    client: {
      token_endpoint_auth_method: process.env.MERCANTEC_CLIENT_SECRET
        ? "client_secret_post"
        : "none",
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? null,
        email: profile.email ?? null,
        roles: normalizeRoles(profile.role),
      };
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [mercantecProvider()],
  callbacks: {
    jwt({ token, user, account }) {
      if (account?.access_token && typeof account.access_token === "string") {
        const payload = decodeJwtPayload(account.access_token) as unknown as MercantecProfile;
        token.sub = payload.sub;
        token.roles = normalizeRoles(payload.role);
      }
      if (user?.roles) {
        token.roles = user.roles;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? session.user.email ?? "";
        session.user.roles = (token.roles as string[]) ?? [];
      }
      return session;
    },
  },
});
