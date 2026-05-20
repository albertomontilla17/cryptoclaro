export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { messages, system } = req.body;

    // Obtener tasas en tiempo real
    let ratesContext = '';
    try {
      // CoinGecko para BTC, ETH, y monedas latam (excepto VES)
      const geckoRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether,bitcoin,ethereum&vs_currencies=usd,cop,ars,mxn'
      );
      const gecko = await geckoRes.json();

      // Yadio.io para la tasa bolívar venezolano (agrega P2P en tiempo real)
      const yadioRes = await fetch('https://api.yadio.io/rate/VES/USD');
      const yadio = await yadioRes.json();
      const usdtVes = yadio?.rate ? (1 / yadio.rate) : null;

      const usdtCop = gecko?.tether?.cop;
      const usdtArs = gecko?.tether?.ars;
      const usdtMxn = gecko?.tether?.mxn;
      const btcUsd  = gecko?.bitcoin?.usd;
      const ethUsd  = gecko?.ethereum?.usd;

      ratesContext = `
═══════════════════════════════
TASAS DE CAMBIO EN TIEMPO REAL (actualizado ahora)
═══════════════════════════════
1 USDT / 1 USD = ${usdtVes  ? usdtVes.toLocaleString('es-VE')  + ' bolívares venezolanos (VES)' : 'no disponible'}
1 USDT / 1 USD = ${usdtCop  ? usdtCop.toLocaleString('es-CO')  + ' pesos colombianos (COP)'     : 'no disponible'}
1 USDT / 1 USD = ${usdtArs  ? usdtArs.toLocaleString('es-AR')  + ' pesos argentinos (ARS)'      : 'no disponible'}
1 USDT / 1 USD = ${usdtMxn  ? usdtMxn.toLocaleString('es-MX')  + ' pesos mexicanos (MXN)'       : 'no disponible'}
1 Bitcoin (BTC) = ${btcUsd  ? '$' + btcUsd.toLocaleString('en-US') + ' USD'                      : 'no disponible'}
1 Ethereum (ETH) = ${ethUsd ? '$' + ethUsd.toLocaleString('en-US') + ' USD'                      : 'no disponible'}

Cuando el usuario pregunte por valores o conversiones, usa estas tasas para hacer cálculos exactos.
Aclara siempre que la tasa varía constantemente y que esta es una referencia del momento actual.
Si el usuario da una cantidad en bolívares, pesos u otra moneda, convierte usando estas tasas.
`;
    } catch {
      ratesContext = '\nNota: No se pudieron obtener las tasas en tiempo real en este momento.\n';
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system: system + ratesContext,
        messages
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
