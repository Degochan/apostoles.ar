# Diseño — Aviso de Operativo ANSES en el index

**Fecha:** 2026-08-31 · **Estado:** aprobado (corrección aplicada: 8/9/2026 es martes)

## Objetivo

Informar en la página principal de apostoles.ar el **Operativo ANSES Apóstoles** del **martes 8 de septiembre de 2026**, con reserva previa de turno por WhatsApp.

## Datos del evento (fuente: flyer provisto por el usuario)

| Campo | Valor |
|---|---|
| Evento | Operativo ANSES — Apóstoles (organizan ANSES + PAMI) |
| Fecha | Martes 8 de septiembre de 2026 |
| Lugar | CAP PAMI Apóstoles — Belgrano 447 |
| Turnos | Por WhatsApp al +54 9 3758 458565, cupos limitados (120 turnos) |
| Trámites | Entrega de libretas, certificado escolar, asignación por embarazo, asignación por nacimiento, pago único por matrimonio, embargo de salario, CODEM, vista de expediente, modificación de datos, clave de seguridad social, Programa Hogar, Monotributo Social |

El número del flyer (3758-458565) coincide con `WA_BOT` en `assets/app.js`, por lo que el CTA usa `irAlBot()` con `wa.me/5493758458565` como `href` de respaldo — mismo patrón que el resto de la página.

## Enfoque elegido

Banner destacado en el index (opción A). Descartados: tarjeta en el tablero (mezcla contenido efímero con el directorio permanente y depende del flujo de publicación externo) y mini-aviso de una línea (pierde lugar, cupos y trámites).

## Implementación

Solo `index.html`:

1. **Estilos** embebidos en el `<head>` (patrón de la página), usando variables existentes (`--green-wa`, `--purple`, `--border`, `--bg-alt`). Estilo de aviso comunitario: borde/fondo suave, contenido centrado, responsive.
2. **Sección** `<section id="aviso-operativo">` ubicada entre el hero y el banner de turnos (`id="turnos"`), con:
   - Badge: "🏛️ AVISO A LA COMUNIDAD"
   - Título: "Operativo ANSES en Apóstoles — martes 8 de septiembre"
   - Subtítulo: lugar (CAP PAMI, Belgrano 447) + "cupos limitados: 120 turnos con reserva previa"
   - Botón verde: "💬 Reservar turno por WhatsApp" → `irAlBot('Hola! Quiero reservar turno para el Operativo ANSES del martes 8 de septiembre (CAP PAMI, Belgrano 447).')`
   - `<details>` "Ver trámites disponibles" con los 12 trámites en chips.
3. **Auto-ocultado:** script mínimo al final del body que aplica `hidden` si la fecha local supera el fin del 8/9/2026 (umbral: 2026-09-09T00:00:00-03:00). Así el aviso no queda viejo en el sitio.
4. **Accesibilidad:** `aria-labelledby` hacia el título, contraste sobre fondo claro, foco visible en el botón.

## Fuera de alcance

- No se toca `tablero.html`, `sitemap.xml` ni `datos/tarjetas.json`.
- No se publica el flyer como imagen (el contenido está volcado en texto).

## Verificación

- Abrir el index localmente en navegador: banner visible entre hero y turnos, botón abre `wa.me/5493758458565` con el mensaje precargado, `<details>` despliega los trámites.
- Probar el auto-ocultado cambiando la hora del sistema no es necesario: se verifica la lógica leyendo el umbral y probando con fecha simulada en consola.
- Validar en viewport móvil (media queries existentes).
