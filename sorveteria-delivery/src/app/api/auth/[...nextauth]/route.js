import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

export const authOptions = {
  providers: [
    // Login Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Login email/senha
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Substitua isso pelo seu banco
        const usuarioFake = {
          email: "admin@email.com",
          senhaHash: await bcrypt.hash("123456", 10),
          nome: "Administrador",
        };

        if (credentials.email !== usuarioFake.email) {
          return null;
        }

        const senhaValida = await bcrypt.compare(credentials.senha, usuarioFake.senhaHash);
        if (!senhaValida) return null;

        // Retorna usuário autenticado
        return { email: usuarioFake.email, name: usuarioFake.nome };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) token.user = user;
      if (account) token.account = account;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.account = token.account;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
