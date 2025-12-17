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

    // --- PRZYGOTOWANIE TREŚCI ---

    // Wspólnicy (dla SC)
    const partnersHtml = data.partners && data.partners.length > 0
      ? `
        <div style="margin-top: 10px; background-color: #f8fafc; padding: 12px; border-radius: 6px;">
          <strong style="color: #64748b; font-size: 13px;">Wspólnicy:</strong>
          <ul style="margin: 5px 0 0 0; padding-left: 20px; color: #334155; font-size: 14px;">
            ${data.partners.map(p => `<li>${escapeHtml(p.name)} (PESEL: <strong>${escapeHtml(p.pesel)}</strong>)</li>`).join('')}
          </ul>
        </div>
      `
      : '';

    // Stylizacja IBAN - zmieniona czcionka na systemową, usunięto monospace
    const ibanDisplay = data.ibanSkipped 
      ? '<span style="color: #d97706; font-weight: bold; background: #fffbeb; padding: 4px 8px; border-radius: 4px; font-size: 12px;">⚠️ Do uzupełnienia później</span>' 
      : (data.iban ? `<span style="font-size: 16px; font-weight: 700; color: #0f172a; letter-spacing: 1px;">${escapeHtml(data.iban)}</span>` : '<span style="color:red">Brak</span>');

    // --- KONFIGURACJA SZABLONU ---

    const logoUrl = 'https://static.wixstatic.com/media/3912d2_cef00b6eb96343d586909632d2e7d630~mv2.png';

    // Style CSS inline - zmniejszone paddingi i marginesy
    const tableRowStyle = 'border-bottom: 1px solid #f1f5f9;';
    const labelCellStyle = 'padding: 8px 10px 8px 0; color: #64748b; font-size: 13px; font-weight: 600; width: 140px; vertical-align: top; text-transform: uppercase; letter-spacing: 0.5px;';
    const valueCellStyle = 'padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 500; vertical-align: top; line-height: 1.5;';
    const sectionHeaderStyle = 'color: #E86C3F; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-top: 25px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #E86C3F; display: inline-block;';

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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F3F6F8; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            .header { background-color: #01152F; padding: 25px; text-align: center; }
            .content { padding: 30px 40px; }
            .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
            .alert { background-color: #fff7ed; border: 1px solid #ffedd5; color: #9a3412; padding: 10px 14px; border-radius: 6px; font-size: 13px; margin-bottom: 20px; display: flex; align-items: center; }
            a { color: #E86C3F; text-decoration: none; font-weight: 600; }
            
            /* Reset tabeli dla maili */
            table { width: 100%; border-collapse: collapse; }
            td { vertical-align: top; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
               <img src="${logoUrl}" alt="FOX UP" width="110" style="display: block; margin: 0 auto; width: 110px; height: auto; border: 0;">
            </div>

            <div class="content">
              <h2 style="margin: 0 0 20px 0; color: #01152F; font-size: 22px; font-weight: 700; text-align: center; letter-spacing: -0.5px;">Nowe zgłoszenie</h2>
              
              <div class="alert">
                <span>🔒 <strong>Dane wrażliwe:</strong> Wiadomość zawiera PESEL/IBAN. Chroń ten e-mail.</span>
              </div>

              <div style="${sectionHeaderStyle}">Dane podmiotu</div>
              <table>
                <tr style="${tableRowStyle}"><td style="${labelCellStyle}">Nazwa firmy</td><td style="${valueCellStyle}">${escapeHtml(data.companyName)}</td></tr>
                <tr style="${tableRowStyle}"><td style="${labelCellStyle}">NIP</td><td style="${valueCellStyle}">${escapeHtml(data.nip)}</td></tr>
                <tr style="${tableRowStyle}"><td style="${labelCellStyle}">Forma prawna</td><td style="${valueCellStyle}">${escapeHtml(legalFormDisplay)}</td></tr>
                ${data.ownerPesel ? `<tr style="${tableRowStyle}"><td style="${labelCellStyle}">PESEL Właściciela</td><td style="${valueCellStyle}">${escapeHtml(data.ownerPesel)}</td></tr>` : ''}
                ${data.representation ? `<tr style="${tableRowStyle}"><td style="${labelCellStyle}">Reprezentacja</td><td style="${valueCellStyle}">${escapeHtml(data.representation)}</td></tr>` : ''}
              </table>

              ${partnersHtml}

              <div style="${sectionHeaderStyle}">Adresy</div>
              <table>
                <tr style="${tableRowStyle}">
                  <td style="${labelCellStyle}">Siedziba</td>
                  <td style="${valueCellStyle}">
                    ${escapeHtml(data.seat.address)}<br>
                    <span style="color: #64748b;">${escapeHtml(data.seat.postalCode)} ${escapeHtml(data.seat.city)}</span>
                  </td>
                </tr>
                <tr style="${tableRowStyle}">
                  <td style="${labelCellStyle}">Korespondencja</td>
                  <td style="${valueCellStyle}">
                    ${escapeHtml(data.correspondence.address)}<br>
                    <span style="color: #64748b;">${escapeHtml(data.correspondence.postalCode)} ${escapeHtml(data.correspondence.city)}</span>
                  </td>
                </tr>
              </table>

              <div style="${sectionHeaderStyle}">Szczegóły operacyjne</div>
              <table>
                <tr style="${tableRowStyle}"><td style="${labelCellStyle}">Kontakt</td><td style="${valueCellStyle}"><a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a><br>${escapeHtml(data.contact.phone)}</td></tr>
                <tr style="${tableRowStyle}">
                  <td style="${labelCellStyle}">Flota</td>
                  <td style="${valueCellStyle}">
                    ${data.fleet.size} <span style="color:#64748b; font-weight:normal;">(${escapeHtml(fleetTypeDisplay)})</span>
                  </td>
                </tr>
                <tr style="${tableRowStyle}"><td style="${labelCellStyle}">Kraje zwrotu</td><td style="${valueCellStyle}">${data.countries.map(c => escapeHtml(c)).join(', ')}</td></tr>
              </table>

              <div style="${sectionHeaderStyle}">Finanse</div>
              <table>
                <tr>
                  <td style="${labelCellStyle}">Numer IBAN</td>
                  <td style="${valueCellStyle}">
                    ${ibanDisplay}
                  </td>
                </tr>
              </table>

            </div>

            <div class="footer">
              <p style="margin: 0;">Zgłoszenie otrzymano: ${new Date(data.submittedAt).toLocaleString('pl-PL')}</p>
              <p style="margin: 5px 0 0 0;">&copy; 2025 Fox up sp. z o.o.</p>
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