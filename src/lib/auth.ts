import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.cliente.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const senhaValida = await bcrypt.compare(credentials.senha, user.senha);
        if (!senhaValida) {
          return null;
        }

        // Incluir isAdmin no retorno
        return { 
          email: user.email, 
          name: user.nome, 
          id: user.id.toString(),
          isAdmin: (user as any).isAdmin || false
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.name = user.name || token.name;
        token.email = user.email || token.email;
      }

      // Mantém dados de credenciais já autenticados
      if (user?.id && !token.id) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        return token;
      }

      // Vincula/gera cliente ao usar Google
      const shouldEnsureCliente = (!token.id && token.email) || account?.provider === "google";
      if (shouldEnsureCliente && token.email) {
        const existing = await prisma.cliente.findUnique({ where: { email: token.email } });
        if (existing) {
          token.id = existing.id.toString();
          token.isAdmin = existing.isAdmin;
          token.name = token.name || existing.nome;
          return token;
        }

        const randomPassword = randomBytes(16).toString("hex");
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        const created = await prisma.cliente.create({
          data: {
            email: token.email,
            nome: token.name || token.email,
            senha: hashedPassword,
          } as any,
        });
        token.id = created.id.toString();
        token.isAdmin = created.isAdmin;
      }

      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
