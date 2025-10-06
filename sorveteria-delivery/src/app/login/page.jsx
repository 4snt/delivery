"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLoginEmail(e) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      senha,
    });

    if (res.error) setMsg(res.error);
    else setMsg("Login realizado com sucesso!");
  }

  if (session) {
    return (
      <div>
        <h1>Olá, {session.user.name}</h1>
        <button onClick={() => signOut()}>Sair</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Login</h1>

      {/* Login com Email/Senha */}
      <form onSubmit={handleLoginEmail}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar com Email</button>
      </form>

      <hr />

      {/* Login com Google */}
      <button onClick={() => signIn("google")}>Entrar com Google</button>

      <p>{msg}</p>
    </div>
  );
}
