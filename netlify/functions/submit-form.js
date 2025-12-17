// netlify/functions/submit-form.js
import nodemailer from 'nodemailer';
import { z } from 'zod';

// 1. Whitelist domen
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://effervescent-florentine-c07f90.netlify.app',
  'https://twoja-domena-na-wix.com'
];

// 2. Funkcja sprawdzająca Origin
const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  const previewRegex = /^https:\/\/deploy-preview-\d+--effervescent-florentine-c07f90\.netlify\.app$/;
  return previewRegex.test(origin);
};

// 3. Schema walidacji
const formSchema = z.object({
  nip: z.string().min(10),
  companyName: z.string().min(1),
  seat: z.object({
    address: z.string(),
    postalCode: z.string(),
    city: z.string(),
  }),
  correspondence: z.object({
    address: z.string(),
    postalCode: z.string(),
    city: z.string(),
  }),
  legalForm: z.string(),
  ownerPesel: z.string().nullable().optional(),
  representation: z.string().nullable().optional(),
  partners: z.array(z.object({
    name: z.string().min(2, "Imię i nazwisko zbyt krótkie"),
    pesel: z.string().min(11, "PESEL musi mieć 11 cyfr")
  })).optional(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(9),
  }),
  fleet: z.object({
    size: z.number().int().positive(),
    type: z.enum(['trucks', 'bus']),
  }),
  countries: z.array(z.string()),
  iban: z.string().nullable().optional(),
  ibanSkipped: z.boolean(),
  consent: z.boolean().refine(val => val === true, { message: "Zgoda jest wymagana" }),
  submittedAt: z.string()
}).superRefine((data, ctx) => {
  if (data.legalForm === 'jdg') {
    if (!data.ownerPesel || data.ownerPesel.length !== 11) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "PESEL jest wymagany dla JDG", path: ["ownerPesel"] });
    }
  }
  if (data.legalForm === 'other') {
    if (!data.representation || data.representation.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Reprezentacja jest wymagana", path: ["representation"] });
    }
  }
  if (data.legalForm === 'sc') {
    if (!data.partners || data.partners.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Spółka cywilna musi mieć min. 2 wspólników", path: ["partners"] });
    }
  }
});

const escapeHtml = (text) => {
  if (!text) return "";
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};

export async function handler(event) {
  const rawOrigin = event.headers.origin || event.headers.Origin || "";
  const cleanOrigin = rawOrigin.replace(/\/$/, "");
  
  const isAllowed = isAllowedOrigin(cleanOrigin);

  if (event.httpMethod !== "OPTIONS" && !isAllowed) {
    console.error(`Blocked Origin: ${cleanOrigin}`);
    return { statusCode: 403, body: JSON.stringify({ error: "Forbidden Origin" }) };
  }

  const allowOriginHeader = isAllowed ? cleanOrigin : 'https://effervescent-florentine-c07f90.netlify.app';

  const headers = {
    "Access-Control-Allow-Origin": allowOriginHeader,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method Not Allowed" };

  try {
    const rawData = JSON.parse(event.body);
    
    const result = formSchema.safeParse(rawData);
    if (!result.success) {
      console.error("Validation error:", JSON.stringify(result.error.format(), null, 2));
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Błąd walidacji", details: result.error.issues }) };
    }
    const data = result.data;

    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    // --- TŁUMACZENIA I FORMATOWANIE ---
    
    const LEGAL_FORMS = {
      jdg: 'Jednoosobowa Działalność Gospodarcza',
      sc: 'Spółka Cywilna',
      other: 'Spółka Prawa Handlowego'
    };

    const FLEET_TYPES = {
      trucks: 'Ciężarowe',
      bus: 'Autokary'
    };

    const legalFormDisplay = LEGAL_FORMS[data.legalForm] || data.legalForm;
    const fleetTypeDisplay = FLEET_TYPES[data.fleet.type] || data.fleet.type;

    // --- KONIEC TŁUMACZEŃ ---

    // Przygotowanie sekcji wspólników
    const partnersHtml = data.partners && data.partners.length > 0
      ? `
        <div style="margin-top: 15px; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
          <strong style="color: #01152F;">Wspólnicy:</strong>
          <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #475569;">
            ${data.partners.map(p => `<li>${escapeHtml(p.name)} (PESEL: <strong>${escapeHtml(p.pesel)}</strong>)</li>`).join('')}
          </ul>
        </div>
      `
      : '';

    // Stylizacja IBAN
    const ibanDisplay = data.ibanSkipped 
      ? '<span style="color: #d97706; font-weight: bold; background: #fffbeb; padding: 2px 6px; border-radius: 4px;">⚠️ Do uzupełnienia później</span>' 
      : (data.iban ? `<span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #01152F;">${escapeHtml(data.iban)}</span>` : '<span style="color:red">Brak</span>');

    const logoUrl = 'https://static.wixstatic.com/media/3912d2_cef00b6eb96343d586909632d2e7d630~mv2.png';

    const mailOptions = {
      from: `"Formularz Fox Up" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      replyTo: data.contact.email,
      subject: `Nowe zgłoszenie: ${escapeHtml(data.companyName)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F3F6F8; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-top: 20px; margin-bottom: 20px; }
            .header { background-color: #01152F; padding: 30px; text-align: center; }
            .content { padding: 40px; color: #334155; }
            .section-title { color: #E86C3F; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; margin-bottom: 10px; margin-top: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
            .data-row { margin-bottom: 8px; font-size: 15px; line-height: 1.5; }
            .label { color: #64748b; font-size: 13px; font-weight: 600; min-width: 120px; display: inline-block; }
            .value { color: #0f172a; font-weight: 500; }
            .alert { background-color: #fff7ed; border-left: 4px solid #E86C3F; color: #9a3412; padding: 15px; border-radius: 4px; font-size: 13px; margin-bottom: 20px; }
            .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
            a { color: #E86C3F; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
               <img src="${logoUrl}" alt="FOX UP" height="50" style="display: block; margin: 0 auto; height: 50px; width: auto; border: 0;">
            </div>

            <div class="content">
              <h2 style="margin: 0 0 20px 0; color: #01152F; font-size: 24px;">Nowe zgłoszenie rejestracyjne</h2>
              
              <div class="alert">
                <strong>🔒 Bezpieczeństwo danych:</strong> Ta wiadomość zawiera wrażliwe dane osobowe (PESEL, IBAN). Chroń dostęp do tej skrzynki pocztowej.
              </div>

              <div class="section-title">Dane firmy</div>
              <div class="data-row"><span class="label">Nazwa:</span> <span class="value">${escapeHtml(data.companyName)}</span></div>
              <div class="data-row"><span class="label">NIP:</span> <span class="value">${escapeHtml(data.nip)}</span></div>
              <div class="data-row"><span class="label">Forma prawna:</span> <span class="value">${escapeHtml(legalFormDisplay)}</span></div>
              ${data.ownerPesel ? `<div class="data-row"><span class="label">PESEL Właściciela:</span> <span class="value">${escapeHtml(data.ownerPesel)}</span></div>` : ''}
              ${data.representation ? `<div class="data-row"><span class="label">Reprezentacja:</span> <span class="value">${escapeHtml(data.representation)}</span></div>` : ''}
              ${partnersHtml}

              <div class="section-title">Adresy</div>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; margin-bottom: 5px;">Siedziba</div>
                <div style="color: #334155;">${escapeHtml(data.seat.address)}</div>
                <div style="color: #334155;">${escapeHtml(data.seat.postalCode)} ${escapeHtml(data.seat.city)}</div>
              </div>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; margin-bottom: 5px;">Korespondencja</div>
                <div style="color: #334155;">${escapeHtml(data.correspondence.address)}</div>
                <div style="color: #334155;">${escapeHtml(data.correspondence.postalCode)} ${escapeHtml(data.correspondence.city)}</div>
              </div>

              <div class="section-title">Szczegóły</div>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 10px;">
                    <div class="data-row"><span class="label">Email:</span> <br><a href="mailto:${escapeHtml(data.contact.email)}" class="value">${escapeHtml(data.contact.email)}</a></div>
                    <div class="data-row"><span class="label">Telefon:</span> <br><span class="value">${escapeHtml(data.contact.phone)}</span></div>
                  </td>
                  <td width="50%" valign="top" style="padding-left: 10px; border-left: 1px solid #e2e8f0;">
                    <div class="data-row"><span class="label">Flota:</span> <br><span class="value">${data.fleet.size} pojazdów (${escapeHtml(fleetTypeDisplay)})</span></div>
                    <div class="data-row"><span class="label">Kraje zwrotu:</span> <br><span class="value">${data.countries.map(c => escapeHtml(c)).join(', ')}</span></div>
                  </td>
                </tr>
              </table>

              <div class="section-title">Dane finansowe</div>
              <div class="data-row">
                <span class="label">Numer IBAN:</span>
                <div style="margin-top: 5px;">${ibanDisplay}</div>
              </div>
            </div>

            <div class="footer">
              Zgłoszenie wygenerowane automatycznie: ${new Date(data.submittedAt).toLocaleString('pl-PL')}<br>
              &copy; 2025 Fox Up Sp. z o.o.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Wysłano' }) };

  } catch (error) {
    console.error('Email error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Błąd serwera' }) };
  }
}