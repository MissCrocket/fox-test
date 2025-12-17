// netlify/functions/submit-form.js
import nodemailer from 'nodemailer';
import { z } from 'zod';

// 1. Whitelist domen
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://effervescent-florentine-c07f90.netlify.app',
  'https://twoja-domena-na-wix.com'
];

// 2. Funkcja sprawdzająca Origin (z obsługą Deploy Previews)
const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  const previewRegex = /^https:\/\/deploy-preview-\d+--effervescent-florentine-c07f90\.netlify\.app$/;
  return previewRegex.test(origin);
};

// 3. Schema walidacji (Zod)
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

// Helper do bezpiecznego HTML (zamiast maskowania)
const escapeHtml = (text) => {
  if (!text) return "";
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};

export async function handler(event) {
  const rawOrigin = event.headers.origin || event.headers.Origin || "";
  const cleanOrigin = rawOrigin.replace(/\/$/, "");
  
  // CORS check
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
    
    // Walidacja
    const result = formSchema.safeParse(rawData);
    if (!result.success) {
      console.error("Validation error:", JSON.stringify(result.error.format(), null, 2));
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Błąd walidacji", details: result.error.issues }) };
    }
    const data = result.data;

    // Konfiguracja SMTP
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    // Budowanie HTML z PEŁNYMI DANYMI
    const partnersHtml = data.partners && data.partners.length > 0
      ? '<h3>Wspólnicy:</h3><ul>' + data.partners.map(p => `<li>${escapeHtml(p.name)} (PESEL: <strong>${escapeHtml(p.pesel)}</strong>)</li>`).join('') + '</ul>'
      : '';

    const ibanDisplay = data.ibanSkipped 
      ? '<span style="color:orange">Do uzupełnienia później</span>' 
      : (data.iban ? `<strong>${escapeHtml(data.iban)}</strong>` : '<span style="color:red">Brak</span>');

    const mailOptions = {
      from: `"Formularz Fox Up" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      replyTo: data.contact.email,
      subject: `Nowe zgłoszenie: ${escapeHtml(data.companyName)}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #E86C3F;">Nowe zgłoszenie rejestracyjne</h2>
          <p style="background: #fff3cd; color: #856404; padding: 10px; border-radius: 5px; font-size: 14px; border: 1px solid #ffeeba;">
            ⚠️ <strong>Uwaga:</strong> Wiadomość zawiera dane osobowe (PESEL, IBAN). Chroń dostęp do tej skrzynki pocztowej.
          </p>
          <hr />
          <h3>Dane firmy:</h3>
          <p><strong>Nazwa:</strong> ${escapeHtml(data.companyName)}</p>
          <p><strong>NIP:</strong> ${escapeHtml(data.nip)}</p>
          <p><strong>Forma:</strong> ${escapeHtml(data.legalForm)}</p>
          <p><strong>PESEL Właściciela:</strong> ${data.ownerPesel ? `<strong>${escapeHtml(data.ownerPesel)}</strong>` : 'Nie dotyczy'}</p>
          ${data.representation ? `<p><strong>Reprezentacja:</strong> ${escapeHtml(data.representation)}</p>` : ''}
          ${partnersHtml}
          
          <h3>Adresy:</h3>
          <p><strong>Siedziba:</strong> ${escapeHtml(data.seat.address)}, ${escapeHtml(data.seat.postalCode)} ${escapeHtml(data.seat.city)}</p>
          <p><strong>Korespondencja:</strong> ${escapeHtml(data.correspondence.address)}, ${escapeHtml(data.correspondence.postalCode)} ${escapeHtml(data.correspondence.city)}</p>
          
          <h3>Kontakt:</h3>
          <p>Email: <a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a></p>
          <p>Telefon: ${escapeHtml(data.contact.phone)}</p>
          
          <h3>Inne:</h3>
          <p>Flota: ${data.fleet.size} (${escapeHtml(data.fleet.type)})</p>
          <p>IBAN: ${ibanDisplay}</p>
          <p>Kraje: ${data.countries.map(c => escapeHtml(c)).join(', ')}</p>
          
          <hr />
          <p style="font-size: 12px; color: #888;">Zgłoszenie wysłano: ${new Date(data.submittedAt).toLocaleString('pl-PL')}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Wysłano' }) };

  } catch (error) {
    console.error('Email error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Błąd serwera' }) };
  }
}