"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  uploadSiteLogoAction,
  removeSiteLogoAction,
  uploadSiteFaviconAction,
  removeSiteFaviconAction,
} from "./actions";

export function LogoFaviconCard({
  initialLogoUrl,
  initialFaviconUrl,
}: {
  initialLogoUrl: string | null;
  initialFaviconUrl: string | null;
}) {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [faviconUrl, setFaviconUrl] = useState(initialFaviconUrl);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadSiteLogoAction(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setLogoUrl(result.data.logoUrl);
      toast.success("Logo actualizado");
      router.refresh();
    });
  }

  function handleRemoveLogo() {
    startTransition(async () => {
      const result = await removeSiteLogoAction();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setLogoUrl(null);
      toast.success("Logo eliminado");
      router.refresh();
    });
  }

  function handleFaviconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadSiteFaviconAction(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setFaviconUrl(result.data.faviconUrl);
      toast.success("Favicon actualizado");
      router.refresh();
    });
  }

  function handleRemoveFavicon() {
    startTransition(async () => {
      const result = await removeSiteFaviconAction();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setFaviconUrl(null);
      toast.success("Favicon eliminado");
      router.refresh();
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <ImageIcon className="size-4" />
          Logo y favicon
        </CardTitle>
        <CardDescription>
          El logo se muestra en la barra de navegación, el pie de página y los paneles. El favicon
          aparece en la pestaña del navegador. Formatos permitidos: PNG, JPEG o WEBP.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-16 rounded-lg">
            {logoUrl && <AvatarImage src={logoUrl} alt="Logo del sitio" />}
            <AvatarFallback className="rounded-lg">BT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">Logo del sitio</p>
            <p className="text-xs text-muted-foreground">Máximo 2MB.</p>
            <div className="flex gap-2">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleLogoChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => logoInputRef.current?.click()}
              >
                Cambiar logo
              </Button>
              {logoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={handleRemoveLogo}
                >
                  Quitar
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-10 rounded-md">
            {faviconUrl && <AvatarImage src={faviconUrl} alt="Favicon del sitio" />}
            <AvatarFallback className="rounded-md text-xs">BT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">Favicon</p>
            <p className="text-xs text-muted-foreground">Recomendado: imagen cuadrada. Máximo 1MB.</p>
            <div className="flex gap-2">
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFaviconChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => faviconInputRef.current?.click()}
              >
                Cambiar favicon
              </Button>
              {faviconUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={handleRemoveFavicon}
                >
                  Quitar
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
