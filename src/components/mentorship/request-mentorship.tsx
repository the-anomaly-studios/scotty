"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export function RequestMentorship({
  toProfileId,
  fromProfileId,
  mentorName,
  isAuthed,
  isSelf,
}: {
  toProfileId: string;
  fromProfileId: string | null;
  mentorName: string;
  isAuthed: boolean;
  isSelf: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Can't request mentorship from yourself.
  if (isSelf) return null;

  // Unauthenticated visitors are sent to sign in first.
  if (!isAuthed || !fromProfileId) {
    return (
      <Link
        href="/login"
        className={cn(buttonVariants({ size: "sm" }), "gap-2")}
      >
        <HeartHandshake className="h-4 w-4" />
        Request mentorship
      </Link>
    );
  }

  async function submit() {
    if (!message.trim()) {
      toast.error("Please write a short message.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/mentorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromProfileId, toProfileId, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong.");
        return;
      }
      toast.success(data.message ?? "Request sent!");
      setMessage("");
      setOpen(false);
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button size="sm" className="gap-2" />}
      >
        <HeartHandshake className="h-4 w-4" />
        Request mentorship
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request mentorship from {mentorName}</DialogTitle>
          <DialogDescription>
            Introduce yourself and explain what you&apos;re hoping to learn. Your
            message and a link to your profile will be sent to {mentorName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="mentorship-message">Your message</Label>
          <Textarea
            id="mentorship-message"
            rows={5}
            placeholder={`Hi ${mentorName}, I'm an MHCI alum interested in…`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            autoFocus
          />
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={submit} disabled={submitting || !message.trim()}>
            {submitting ? "Sending…" : "Send request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
