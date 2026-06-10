// Plain, table-free HTML email templates for the mentorship request flow.
// Two variants: one sent to the mentor (when they've shared a personal email),
// and one sent back to the requester directing them to LinkedIn otherwise.

const WRAP = (inner: string) => `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1a1a;line-height:1.6">
  ${inner}
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0 16px" />
  <p style="font-size:12px;color:#999;margin:0">Sent via the CMU MHCI Alumni Directory.</p>
</div>`;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphs(message: string) {
  return escapeHtml(message)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 12px;white-space:pre-line">${p}</p>`)
    .join("");
}

export function mentorEmail({
  mentorName,
  requesterName,
  requesterProfileUrl,
  message,
}: {
  mentorName: string;
  requesterName: string;
  requesterProfileUrl: string;
  message: string;
}) {
  const subject = `${requesterName} would like to connect with you (MHCI mentorship)`;
  const html = WRAP(`
    <p style="margin:0 0 16px">Hi ${escapeHtml(mentorName)},</p>
    <p style="margin:0 0 16px"><strong>${escapeHtml(
      requesterName
    )}</strong>, a fellow CMU MHCI alum, has requested mentorship through the alumni directory.</p>
    <div style="background:#f6f6f4;border-radius:8px;padding:16px 18px;margin:0 0 20px">
      ${paragraphs(message)}
    </div>
    <p style="margin:0 0 8px">View their profile:</p>
    <p style="margin:0 0 16px"><a href="${requesterProfileUrl}" style="color:#C41230">${requesterProfileUrl}</a></p>
    <p style="margin:0;color:#555;font-size:14px">Reply directly to this email to reach ${escapeHtml(
      requesterName
    )}.</p>
  `);
  const text = `Hi ${mentorName},

${requesterName}, a fellow CMU MHCI alum, has requested mentorship through the alumni directory.

"${message}"

View their profile: ${requesterProfileUrl}

Reply directly to this email to reach ${requesterName}.`;

  return { subject, html, text };
}

export function requesterFallbackEmail({
  mentorName,
  requesterName,
  linkedinUrl,
  message,
}: {
  mentorName: string;
  requesterName: string;
  linkedinUrl: string | null;
  message: string;
}) {
  const subject = `About your mentorship request to ${mentorName}`;
  const linkedinBlock = linkedinUrl
    ? `<p style="margin:0 0 8px">You can reach out to them on LinkedIn:</p>
       <p style="margin:0 0 16px"><a href="${linkedinUrl}" style="color:#C41230">${linkedinUrl}</a></p>`
    : `<p style="margin:0 0 16px">They haven't shared any direct contact links yet — you may want to check back later or connect through the MHCI alumni network.</p>`;

  const html = WRAP(`
    <p style="margin:0 0 16px">Hi ${escapeHtml(requesterName)},</p>
    <p style="margin:0 0 16px"><strong>${escapeHtml(
      mentorName
    )}</strong> hasn't shared a personal email address in the directory, so we couldn't deliver your message directly.</p>
    ${linkedinBlock}
    <p style="margin:0 0 8px;color:#555;font-size:14px">For your reference, here's the message you wrote:</p>
    <div style="background:#f6f6f4;border-radius:8px;padding:16px 18px;margin:0">
      ${paragraphs(message)}
    </div>
  `);
  const text = `Hi ${requesterName},

${mentorName} hasn't shared a personal email address in the directory, so we couldn't deliver your message directly.

${linkedinUrl ? `You can reach out to them on LinkedIn: ${linkedinUrl}` : "They haven't shared any direct contact links yet."}

For your reference, here's the message you wrote:
"${message}"`;

  return { subject, html, text };
}
