export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { messages, system } = req.body;

    // Obtener tasas en tiempo real de CoinGecko
    let ratesContext = '';
    try {
      const ratesRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether,bitcoin,ethereum&vs_currencies=usd,ves,cop,ars,mxn'
      );
      const rates = await ratesRes.json();

      const usdtVes = rates?.tether?.ves;
      const usdtCop = rates?.tether?.cop;
      const usdtArs = rates?.tether?.ars;
      const usdtMxn = rates?.tether?.mxn;
      const btcUsd = rates?.bitcoin?.usd;
      const ethUsd = rates?.ethereum?.usd;

      ratesContext = `
═══════════════════════════════
TASAS DE CAMBIO EN TIEMPO REAL (actualizado ahora)
═══════════════════════════════
1 USDT = ${usdtVes ? usdtVes.toLocaleString('es-VE') + ' bolívares (VES)' : 'no disponible'}
1 USDT = ${usdtCop ? usdtCop.toLocaleString('es-CO') + ' pesos colombianos (COP)' : 'no disponible'}
1 USDT = ${usdtArs ? usdtArs.toLocaleString('es-AR') + ' pesos argentinos (ARS)' : 'no disponible'}
1 USDT = ${usdtMxn ? usdtMxn.toLocaleString('es-MX') + ' pesos mexicanos (MXN)' : 'no disponible'}
1 Bitcoin = ${btcUsd ? '$' + btcUsd.toLocaleString('en-US') + ' USD' : 'no disponible'}
1 Ethereum = ${ethUsd ? '$' + ethUsd.toLocaleString('en-US') + ' USD' : 'no disponible'}

Usa estas tasas para hacer cálculos cuando el usuario pregunte por valores o conversiones. 
Aclara siempre que la tasa varía constantemente y que esta es una referencia del momento.
`;
    } catch {
      ratesContext = '\nNota: No se pudieron obtener las tasas en tiempo real en este momento.\n';
    }

    // Llamar a Claude con el contexto de tasas inyectado
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
