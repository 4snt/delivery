import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    // Redireciona usuários não logados para a página de login
    signIn: "/login",
  },
});

export const config = {
  // Define quais rotas serão protegidas
  matcher: ["/protegido/:path*"], // todas as rotas dentro de /protegido
};
