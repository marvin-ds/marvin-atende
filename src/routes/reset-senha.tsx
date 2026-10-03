import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { brand } from "@/config/brand";

export const Route = createFileRoute("/reset-senha")({
  ssr: false,
  head: () => ({ meta: [{ title: `${brand.name} — Definir nova senha` }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const ready = !!resetToken;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setResetToken(params.get("token") || params.get("oobCode") || "");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.length < 6) return toast.error("Senha precisa ter pelo menos 6 caracteres.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd, resetToken });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada!");
    navigate({ to: "/entrar", replace: true });
  }

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-gradient-to-br from-primary/10 via-background to-background">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-xl font-bold mb-1">Nova senha</h1>
        <p className="text-sm text-muted-foreground mb-4">{ready ? "Defina sua nova senha." : "Link de recuperação ausente ou inválido. Solicite um novo em Esqueci minha senha."}</p>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Nova senha</Label>
            <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required disabled={!ready} />
          </div>
          <Button type="submit" disabled={loading || !ready} className="w-full">
            {loading ? "Salvando…" : "Atualizar senha"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
