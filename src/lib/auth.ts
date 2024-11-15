import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import { authConfig } from "@/auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

export const config = {
  ...authConfig,
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "user";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
