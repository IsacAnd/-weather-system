// src/components/auth/RegisterForm.tsx
import { useState } from "react";
import { api } from "../../api/api";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import toast from 'react-hot-toast';

export function RegisterForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const resp = await api.post("/users", {
                email,
                password,
                name,
            });

            console.log(resp)

            toast.success("Conta criada com sucesso!");
            window.location.href = "/login";
        } catch (err: any) {
            console.error(err);
            toast.error(err.message ?? "Erro ao cadastrar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
            <Card className="w-full max-w-md shadow-2xl border-zinc-700 bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-white">
                        Criar Conta
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            placeholder="Nome"
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

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
                            {loading ? "Criando..." : "Criar Conta"}
                        </Button>

                        <p className="text-zinc-400 text-sm text-center mt-2">
                            Já possui conta?{" "}
                            <a href="/login" className="text-indigo-400 hover:underline">
                                Entrar
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
