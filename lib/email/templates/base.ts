import { getEmailConfig } from "@/lib/email/config";

type BaseTemplateOptions = {
  previewText: string;
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
};

export function renderBaseEmail({
  previewText,
  title,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerNote,
}: BaseTemplateOptions) {
  const { appName, appUrl } = getEmailConfig();

  const ctaBlock =
    ctaLabel && ctaUrl
      ? `<p style="margin: 28px 0 0;">
          <a href="${ctaUrl}" style="display: inline-block; background: #cc785c; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;">
            ${ctaLabel}
          </a>
        </p>
        <p style="margin: 16px 0 0; font-size: 13px; color: #6c6a64; word-break: break-all;">
          ${ctaUrl}
        </p>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background: #faf9f5; font-family: sans-serif; color: #3d3d3a;">
    <span style="display: none; max-height: 0; overflow: hidden;">${previewText}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #faf9f5; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background: #ffffff; border: 1px solid #e6dfd8; border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="padding: 28px 28px 8px; font-family: serif; font-size: 22px; color: #141413;">
                ${appName}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 28px 28px;">
                <h1 style="margin: 0 0 16px; font-family: serif; font-size: 28px; font-weight: 400; color: #141413;">
                  ${title}
                </h1>
                <div style="font-size: 16px; line-height: 1.55; color: #3d3d3a;">
                  ${bodyHtml}
                </div>
                ${ctaBlock}
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 28px; background: #181715; color: #a09d96; font-size: 13px; line-height: 1.4;">
                ${footerNote ?? `You are receiving this email from ${appName}.`}
                <br />
                <a href="${appUrl}" style="color: #faf9f5;">${appUrl.replace(/^https?:\/\//, "")}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${title}

${previewText}
${ctaLabel && ctaUrl ? `\n${ctaLabel}: ${ctaUrl}` : ""}

${footerNote ?? `You are receiving this email from ${appName}.`}
${appUrl}`;

  return { html, text };
}
