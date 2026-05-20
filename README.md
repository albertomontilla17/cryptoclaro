# CryptoClaro 🟢

**Crypto en tu idioma.** La herramienta que ayuda al latinoamericano a entender criptomonedas para proteger sus ahorros de la inflación — sin términos complicados, sin estafas.

🌐 **[cryptoclaro.vercel.app](https://cryptoclaro.vercel.app)**

---

## ¿Qué es CryptoClaro?

En Latinoamérica, millones de personas usan crypto no para especular sino para sobrevivir económicamente — proteger ahorros de la inflación, recibir remesas, o simplemente tener acceso a dólares digitales.

El problema: la mayoría de recursos sobre crypto están en inglés, son técnicos, y no hablan de la realidad latinoamericana.

CryptoClaro resuelve eso. Es una web app que combina:

- **Guías estáticas por país** — pasos concretos para comprar crypto según tu banco y tu país
- **Asistente de IA** — responde preguntas en español latinoamericano, con contexto local, honesto sobre los riesgos

---

## Países disponibles

| País | Métodos |
|------|---------|
| 🇻🇪 Venezuela | Binance P2P + Pago Móvil, Crixto, Banco del Tesoro |
| 🇨🇴 Colombia | Nequi, Daviplata, Buda.com |
| 🇦🇷 Argentina | Lemon Cash, Ripio, Binance P2P |
| 🇲🇽 México | Bitso, SPEI, Binance P2P |
| 🇵🇪 Perú | Próximamente |
| 🇪🇨 Ecuador | Próximamente |

---

## Stack técnico

- **Frontend:** HTML, CSS, JavaScript vanilla
- **Backend:** Vercel Serverless Functions (Node.js)
- **IA:** Claude API (Anthropic) — claude-sonnet-4-5
- **Analytics:** Google Sheets via Apps Script
- **Deploy:** Vercel + GitHub CI/CD

---

## Características

- ✅ Guías paso a paso por país y método de pago
- ✅ Asistente IA con contexto completo de Latinoamérica 2026
- ✅ Sección de seguridad — cómo reconocer estafas
- ✅ Límite de 10 preguntas diarias por usuario
- ✅ Registro automático de preguntas en Google Sheets
- ✅ Diseño responsive — mobile first
- ✅ Sin frameworks — HTML/CSS/JS puro

---

## Estructura del proyecto

```
cryptoclaro/
├── index.html        # Frontend completo
├── api/
│   └── chat.js       # Serverless function — proxy a Claude API
├── README.md
└── LICENSE
```

---

## Variables de entorno

Para correr el proyecto necesitas:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Configúrala en Vercel → Settings → Environment Variables.

---

## Roadmap

- [ ] Agregar Perú y Ecuador
- [ ] Sistema de autenticación para límite de preguntas más robusto
- [ ] Modelo de monetización freemium
- [ ] Afiliados con Binance, Bitso y Lemon Cash
- [ ] App móvil

---

## Autor

Construido por [@albertomontilla17](https://github.com/albertomontilla17)

---

*CryptoClaro no es asesoría financiera. Siempre verifica antes de invertir.*
