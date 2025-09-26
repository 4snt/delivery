import { signClienteToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, nome } = body || {};
    if (!email) {
      return Response.json({ error: 'email obrigatório' }, { status: 400 });
    }
    const token = signClienteToken({ email, nome });
    return Response.json({ token });
  } catch (e) {
    return Response.json({ error: 'erro ao gerar token' }, { status: 500 });
  }
}


