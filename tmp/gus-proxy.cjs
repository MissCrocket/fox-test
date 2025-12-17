const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Obsługa tylko metody POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const GUS_TARGET_URL = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';
  
  try {
    const soapEnvelope = event.body;
    // Nagłówki w Netlify są znormalizowane do małych liter
    const sid = event.headers['sid'] || event.headers['Sid']; 

    const headers = {
      'Content-Type': 'application/soap+xml; charset=utf-8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 
    };

    if (sid) {
      headers['sid'] = sid;
    }

    const response = await fetch(GUS_TARGET_URL, {
      method: 'POST',
      headers: headers,
      body: soapEnvelope
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*', // CORS dla Twojej strony
        'Access-Control-Allow-Headers': 'Content-Type, sid',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: data
    };

  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed connecting to GUS' })
    };
  }
};