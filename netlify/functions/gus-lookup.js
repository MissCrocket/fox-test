import { XMLParser } from 'fast-xml-parser';
import { decode } from 'he';

const GUS_URL = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc";

// Konfiguracja CORS
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://roaring-custard-43066a.netlify.app',
  'https://twoja-domena-na-wix.com'
];

// Parser tylko do czystych danych (krok końcowy)
const parser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: true
});

// Helper: usuwa nagłówki MIME (Multipart), zostawia czysty XML
const cleanXML = (raw) => {
  const match = raw.match(/<([a-z0-9]+:)?Envelope/i);
  if (match && match.index > 0) {
    return raw.substring(match.index);
  }
  return raw;
};

// Helper: wyciąga wartość tagu Regexem (odporny na MTOM i namespace'y)
const extractTag = (xml, tagName) => {
  const re = new RegExp(
    `<(?:[a-z0-9]+:)?${tagName}[^>]*>([\\s\\S]*?)<\\/(?:[a-z0-9]+:)?${tagName}>`,
    "i"
  );
  const m = xml.match(re);
  return m ? m[1].trim() : null;
};

const isValidNIP = (nip) => {
  if (typeof nip !== 'string') return false;
  const nipNoDashes = nip.replace(/[\s-]/g, '');
  if (nipNoDashes.length !== 10 || !/^\d+$/.test(nipNoDashes)) return false;
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  for (let i = 0; i < 9; i++) { sum += parseInt(nipNoDashes[i]) * weights[i]; }
  const control = sum % 11;
  return control === parseInt(nipNoDashes[9]);
};

const sendSoap = async (action, body, sid = null) => {
  // Action w nagłówku Content-Type
  const headers = { 
    "Content-Type": `application/soap+xml; charset=utf-8; action="${action}"` 
  };
  
  if (sid) headers.sid = sid;

  const envelope = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07" xmlns:dat="http://CIS/BIR/PUBL/2014/07/DataContract">
      <soap:Header>
        <wsa:To xmlns:wsa="http://www.w3.org/2005/08/addressing">${GUS_URL}</wsa:To>
        <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing">${action}</wsa:Action>
      </soap:Header>
      <soap:Body>${body}</soap:Body>
    </soap:Envelope>
  `;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(GUS_URL, { 
      method: "POST", 
      headers, 
      body: envelope,
      signal: controller.signal
    });

    const text = await response.text();

    if (!response.ok) {
      console.error(`GUS HTTP Error ${response.status}:`, text.slice(0, 500));
      throw new Error(`GUS zwrócił błąd HTTP: ${response.status}`);
    }

    return text;
  } finally {
    clearTimeout(timeoutId);
  }
};

export async function handler(event) {
  const origin = event.headers.origin || event.headers.Origin || "";
  const cleanOrigin = origin.replace(/\/$/, "");

  // Twarda blokada CORS
  if (event.httpMethod !== "OPTIONS" && !ALLOWED_ORIGINS.includes(cleanOrigin)) {
    return { statusCode: 403, body: JSON.stringify({ error: "Forbidden Origin" }) };
  }

  const headers = {
    "Access-Control-Allow-Origin": cleanOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };

  try {
    const { nip } = JSON.parse(event.body);
    const apiKey = process.env.GUS_API_KEY;

    if (!nip || !isValidNIP(nip)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Nieprawidłowy numer NIP" }) };
    }
    if (!apiKey) {
      console.error("CRITICAL: Brak GUS_API_KEY");
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Błąd konfiguracji serwera" }) };
    }

    // --- 1. LOGOWANIE ---
    const loginBody = `<ns:Zaloguj><ns:pKluczUzytkownika>${apiKey}</ns:pKluczUzytkownika></ns:Zaloguj>`;
    const loginRaw = await sendSoap("http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj", loginBody);
    
    // Czyszczenie i wyciąganie SID regexem
    const loginXml = cleanXML(loginRaw);
    const sid = extractTag(loginXml, "ZalogujResult");

    if (!sid) {
      console.error("GUS Login Failed. Raw Response:", loginRaw.slice(0, 1000));
      throw new Error("Nie udało się zalogować do GUS (brak SID w odpowiedzi)");
    }

    // --- 2. WYSZUKIWANIE ---
    const cleanNip = nip.replace(/[\s-]/g, "");
    const searchBody = `
      <ns:DaneSzukajPodmioty>
        <ns:pParametryWyszukiwania><dat:Nip>${cleanNip}</dat:Nip></ns:pParametryWyszukiwania>
      </ns:DaneSzukajPodmioty>`;
    
    const searchRaw = await sendSoap("http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty", searchBody, sid);
    
    // Czyszczenie i wyciąganie wyniku regexem
    const searchXml = cleanXML(searchRaw);
    const resultStrEnc = extractTag(searchXml, "DaneSzukajPodmiotyResult");

    if (!resultStrEnc) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "Nie znaleziono firmy w bazie GUS" }) };
    }

    // Dekodowanie encji HTML i parsowanie właściwych danych
    const resultXml = decode(resultStrEnc);
    const companyData = parser.parse(resultXml)?.root?.dane;

    if (!companyData) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "Puste dane firmy" }) };
    }

    // --- 3. WYLOGOWANIE (Fire & Forget) ---
    try {
      sendSoap("http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Wyloguj", `<ns:Wyloguj><ns:pIdentyfikatorSesji>${sid}</ns:pIdentyfikatorSesji></ns:Wyloguj>`, sid);
    } catch(e) {}

    // Mapowanie danych
    const address = companyData.Ulica 
        ? `${companyData.Ulica} ${companyData.NrNieruchomosci}${companyData.NrLokalu ? '/' + companyData.NrLokalu : ''}`
        : `${companyData.Miejscowosc} ${companyData.NrNieruchomosci}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        companyName: companyData.Nazwa,
        seatAddress: address,
        seatPostal: companyData.KodPocztowy,
        seatCity: companyData.Miejscowosc,
        regon: companyData.Regon
      })
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      return { statusCode: 504, headers, body: JSON.stringify({ error: "Zbyt długi czas oczekiwania na GUS" }) };
    }
    console.error("GUS Function Error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Błąd komunikacji z GUS" }) };
  }
}