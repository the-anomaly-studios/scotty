"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { setHeadshotUrl } from "@/app/profile/actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

type Props = {
  currentUrl: string | null;
  onUpload: (url: string) => void;
};

export function HeadshotUploader({ currentUrl, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the input so re-selecting the same file fires onChange again.
    e.target.value = "";

    if (!ALLOWED.includes(file.type)) {
      toast.error("File must be a JPG, PNG, or WebP image");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File must be under 5MB");
      return;
    }

    // Local preview while the upload runs.
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setPreview(currentUrl);
      toast.error("You must be signed in to upload a photo");
      return;
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${user.id}/headshot.${ext}`;

    // Direct browser-to-Supabase upload — bypasses the Server Action body limit.
    const { error: uploadError } = await supabase.storage
      .from("headshots")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setLoading(false);
      setPreview(currentUrl);
      toast.error(uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("headshots").getPublicUrl(path);
    // Cache-bust so a replaced photo at the same path renders immediately.
    const bustedUrl = `${publicUrl}?v=${Date.now()}`;

    const result = await setHeadshotUrl(bustedUrl);

    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      setPreview(currentUrl);
    } else if (result.url) {
      onUpload(result.url);
      setPreview(result.url);
      toast.success("Headshot updated");
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative group w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Upload headshot"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Headshot preview"
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-muted-foreground text-3xl font-heading flex items-center justify-center h-full">
            ?
          </span>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {loading ? (
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? "Uploading…" : "Change photo"}
      </Button>
      <p className="text-xs text-muted-foreground">JPG, PNG or WebP · max 5MB</p>
    </div>
  );
}
