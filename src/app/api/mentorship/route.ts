import { createClient } from "@/lib/supabase/server";
import { mentorEmail, requesterFallbackEmail } from "@/lib/email/mentorship";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const requestSchema = z.object({
  fromProfileId: z.string().uuid(),
  toProfileId: z.string().uuid(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logged-in alumni only.
  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request data." }, { status: 400 });
  }
  const { fromProfileId, toProfileId, message } = parsed.data;

  if (fromProfileId === toProfileId) {
    return NextResponse.json(
      { error: "You can't request mentorship from yourself." },
      { status: 400 }
    );
  }

  // Verify the requester profile actually belongs to the signed-in user, so
  // the sender identity can't be spoofed from the client.
  const { data: fromProfile } = await supabase
    .from("profiles")
    .select("id, name, user_id")
    .eq("id", fromProfileId)
    .single();

  if (!fromProfile || fromProfile.user_id !== user.id) {
    return NextResponse.json({ error: "Profile mismatch." }, { status: 403 });
  }

  const { data: toProfile } = await supabase
    .from("profiles")
    .select("id, name, personal_email, linkedin_url, is_mentorship_open")
    .eq("id", toProfileId)
    .eq("is_active", true)
    .single();

  if (!toProfile) {
    return NextResponse.json({ error: "Mentor not found." }, { status: 404 });
  }
  if (!toProfile.is_mentorship_open) {
    return NextResponse.json(
      { error: "This alum isn't open to mentorship requests." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const from = process.env.MENTORSHIP_FROM_EMAIL || "onboarding@resend.dev";
  const origin = req.nextUrl.origin;

  const requesterName = fromProfile.name ?? "An MHCI alum";
  const mentorName = toProfile.name ?? "there";
  const requesterEmail = user.email!;

  try {
    if (toProfile.personal_email) {
      // Mentor reachable directly — send them the request.
      const { subject, html, text } = mentorEmail({
        mentorName,
        requesterName,
        requesterProfileUrl: `${origin}/people/${fromProfile.id}`,
        message,
      });
      const { error } = await resend.emails.send({
        from,
        to: toProfile.personal_email,
        replyTo: requesterEmail,
        subject,
        html,
        text,
      });
      if (error) throw new Error(error.message);

      return NextResponse.json({
        ok: true,
        delivered: "mentor",
        message: "Your request was sent to the mentor.",
      });
    } else {
      // No personal email on file — send the requester a note pointing them to
      // the mentor's LinkedIn instead.
      const { subject, html, text } = requesterFallbackEmail({
        mentorName: toProfile.name ?? "This alum",
        requesterName,
        linkedinUrl: toProfile.linkedin_url,
        message,
      });
      const { error } = await resend.emails.send({
        from,
        to: requesterEmail,
        subject,
        html,
        text,
      });
      if (error) throw new Error(error.message);

      return NextResponse.json({
        ok: true,
        delivered: "requester",
        message: toProfile.linkedin_url
          ? "This alum hasn't shared an email — we've sent you their LinkedIn to connect."
          : "This alum hasn't shared contact details — check the email we sent you.",
      });
    }
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Couldn't send the request: ${detail}` },
      { status: 502 }
    );
  }
}
