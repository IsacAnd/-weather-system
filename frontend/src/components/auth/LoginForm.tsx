// src/components/auth/LoginForm.tsx
import { useState } from "react";
import { api } from "../../api/api";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import toast from 'react-hot-toast';

interface LoginResponse {
    access_token: string;
}

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post<LoginResponse>("/auth/login", { email, password });

            localStorage.setItem("token", res.access_token);

            toast.success("Login realizado com sucesso!");

            window.location.href = "/dashboard";
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Erro ao fazer login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
            <Card className="w-full max-w-md shadow-2xl border-zinc-700 bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-white">
                        Login
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="E-mail"
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            type="password"
                            placeholder="Senha"
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            disabled={loading}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>

                        <p className="text-zinc-400 text-sm text-center mt-2">
                            Não tem conta?{" "}
                            <a href="/register" className="text-indigo-400 hover:underline">
                                Criar conta
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
