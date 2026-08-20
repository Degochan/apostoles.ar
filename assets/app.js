/* ── Configuración compartida ITe Apóstoles ─────────────────────────── */
const WA_BOT = '5493743434312'; // Bot de turnos / trámites
const WA_ADMIN = '5493743454291'; // Superadmin / sumar tarjetas

/* ── Utilidades WhatsApp ──────────────────────────────────── */
function _abrirWA(numero, texto) {
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
}

// Botones "Pedir turno"
function irAlBot(texto) { _abrirWA(WA_BOT, texto); }

// Botones de organizaciones + contacto admin
function irAlAdmin(texto) { _abrirWA(WA_ADMIN, texto); }

// Redirige a números específicos de tarjetas del tablero
function irAContactar(numero, texto) { _abrirWA(numero, texto); }