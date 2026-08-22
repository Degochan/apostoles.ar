# Manual de Uso y Mantenimiento — Apóstoles.ar (apostoles.ar)

## 1. Qué es este sitio

**Apóstoles.ar** es un portal comunitario estático para la ciudad de Apóstoles, Misiones. Tiene dos funciones principales:

1. **Cartelera digital** (`tablero.html`): directorio de emprendimientos, profesionales, empresas y CVs de postulantes, con contacto directo por WhatsApp.
2. **Gestión de turnos por WhatsApp**: botones que abren chats de `wa.me` hacia el bot de turnos o el número de administración.

No hay backend, base de datos ni aplicaciones que compilar: es HTML + CSS + JavaScript puro servido directamente. Todo el contenido vive en los archivos.

## 2. Arquitectura y archivos

```
apostoles.ar/
├── index.html          → Página principal (landing: hero, turnos, teléfonos útiles, turismo, FAQ)
├── tablero.html        → Cartelera: buscador, filtros y tarjetas con lightbox
├── t/{slug}.html       → Ficha SEO individual de cada tarjeta publicada
├── assets/
│   ├── style.css       → Estilos base compartidos (variables de diseño, navbar, footer, botones)
│   ├── app.js          → Configuración central de números de WhatsApp + utilidades
│   └── *.webp/.jpeg    → Imágenes de tarjetas (una por emprendimiento) + flyers/escudo
├── CNAME               → Dominio personalizado: apostoles.ar (GitHub Pages)
├── .nojekyll           → Desactiva Jekyll en GitHub Pages
├── robots.txt          → Permite todos los crawlers, incluidos bots de IA (GPTBot, ClaudeBot, etc.)
├── sitemap.xml         → Inicio, tablero y fichas individuales publicadas
├── llms.txt            → Descripción semántica del sitio para LLMs / GEO
└── .well-known/security.txt → Contacto de seguridad
```

### Publicación (deployment)

- El repositorio git es `git@github.com:Degochan/apostoles.ar.git` (rama `main`).
- El hosting es **GitHub Pages** con dominio personalizado `apostoles.ar` (archivo `CNAME`).
- **Publicar = hacer commit en `main` y push.** GitHub Pages sirve el sitio automáticamente en 1–2 minutos. No hay proceso de build.

### Números de WhatsApp (assets/app.js)

```js
const WA_BOT   = '5493743434312'; // Bot de turnos / trámites
const WA_ADMIN = '5493743454291'; // Superadmin / sumar tarjetas
```

- `irAlBot(texto)` → abre chat con el bot de turnos.
- `irAlAdmin(texto)` → abre chat con administración.
- `irAContactar(numero, texto)` → abre chat con el número de una tarjeta específica.

> Para cambiar un número de WhatsApp general, editá solo `assets/app.js`. Para el número de una tarjeta individual, está además hardcodeado en el `href` del botón dentro de `tablero.html`.

## 3. Cómo funciona cada página

### index.html (inicio)

Secciones en orden: navbar → hero con escudo → banner de turnos → barra de stats → **Comercio destacado** (se carga desde `datos/tarjetas.json`) → teléfonos útiles (Hospital, Bomberos, Policía, Municipalidad) → turismo yerbatero → CTA al tablero → casos de uso → cómo funciona → CTA organizaciones → FAQ (acordeón con `toggleFaq`) → CTA final → footer → botón flotante de WhatsApp.

El bloque **Comercio destacado** muestra hasta tres tarjetas con `destacado: true`, enlazadas a su tarjeta propia en `tablero.html?t=slug`. No se cargan nombres ni imágenes a mano: al publicar desde La Fragata se actualiza el JSON y el index las vuelve a leer.

Los estilos de esta página están **embebidos en el `<head>`** del archivo, sobre la base de `assets/style.css`.

### tablero.html (cartelera)

- Cada emprendimiento es un bloque `<div class="tarjeta-card">` con:
  - `data-category` → categoría del filtro: `profesionales`, `emprendimientos`, `empresas` o `cvs`.
  - `data-keywords` → palabras clave para el buscador (siempre en minúsculas, sin tildes).
  - Imagen (`assets/nombre.webp`) con `openLightbox()` al hacer clic para ampliar.
  - Título, badge de categoría, descripción y botón(es) de WhatsApp con mensaje precargado.
- El título de cada tarjeta enlaza a `t/{slug}.html`, una ficha estática con
  descripción completa, imagen, todos los contactos, redes y datos estructurados.
- El buscador normaliza el texto (quita tildes, minúsculas) y filtra por keywords + título + descripción. Los botones de filtro combinan con la búsqueda (AND).
- Muestra contador de resultados y mensaje "no encontramos resultados" si no hay coincidencias.

## 4. Tareas de mantenimiento

### 4.1 Agregar una tarjeta nueva (lo más frecuente)

1. **Preparar la imagen**: flyer cuadrado o vertical, idealmente en **WebP** y de peso razonable (< 200 KB). Guardarla en `assets/` con nombre descriptivo, ej. `panaderia_xxx.webp`. Si viene en JPEG/PNG, convertir (ej.: `cwebp entrada.jpg -o salida.webp -q 80` o con Squoosh).
2. **Copiar una tarjeta existente** en `tablero.html` (cualquier bloque `<div class="tarjeta-card">…</div>`) y pegarla encima del bloque `no-results`. Completar:
   - `data-category`: `profesionales` | `emprendimientos` | `empresas` | `cvs`
   - `data-keywords`: nombre del negocio, rubro, sinónimos, todo en minúscula y sin tildes.
   - `onclick="openLightbox('assets/archivo.webp')"` y el `src` de la imagen, con `width`/`height` reales (evita saltos de layout).
   - Título, descripción y botón de WhatsApp con el número del emprendedor en formato `549XXXXXXXXXX` **sin el `+`**.
3. **(Opcional pero recomendado)** Si la tarjeta es destacada, agregarla al JSON-LD `ItemList` del `<head>` de `tablero.html`.
4. **Publicar**: commit + push a `main`.

### 4.2 Editar o dar de baja una tarjeta

- Editar: modificar directamente los campos del bloque correspondiente en `tablero.html`.
- Baja: eliminar el bloque HTML. La imagen puede quedar en `assets/` (no molesta), pero si se borra, verificar que ninguna otra tarjeta la use.

### 4.3 Cambiar teléfonos útiles o textos del inicio

Todo está en `index.html` como HTML plano: buscar el número/texto y editar. Los enlaces `tel:` usan formato `+543758XXXXXX`.

### 4.4 SEO y contenido para IA

- `sitemap.xml`: actualizar `lastmod` cuando cambie contenido relevante. Si se agrega una página nueva, sumarla al sitemap.
- `llms.txt`: actualizar si cambian servicios, rubros o teléfonos institucionales.
- `robots.txt` permite explícitamente bots de IA — mantenerlo si interesa el posicionamiento en buscadores con IA.

### 4.5 Dominio y DNS

- El dominio `apostoles.ar` está configurado como dominio personalizado de GitHub Pages (CNAME). Los DNS apuntan a GitHub (registros A / CNAME según configuración del registrador).
- El archivo `CNAME` del repo **no debe borrarse**; sin él GitHub Pages deja de servir el dominio personalizado.
- HTTPS: GitHub Pages emite el certificado automáticamente una vez verificado el dominio (configuración del repo en GitHub → Settings → Pages).

## 5. Flujo de trabajo recomendado (publicar cambios)

```bash
# 1. Editar archivos localmente
# 2. Ver localmente (opcional):
python3 -m http.server 8000   # abrir http://localhost:8000

# 3. Publicar:
git add -A
git commit -m "Cartelera: agrego [nombre de tarjeta]"
git push origin main
# GitHub Pages publica solo en 1-2 min
```

Verificar siempre en https://apostoles.ar (y con hard-refresh, Cmd+Shift+R, por la caché del navegador).

## 6. Checklist de control de calidad ante cada cambio

- [ ] La imagen nueva carga y el lightbox amplía la imagen correcta.
- [ ] El botón de WhatsApp abre el chat con el número y mensaje correctos (probar en el celular).
- [ ] La tarjeta aparece con el filtro de su categoría y el buscador la encuentra por sus keywords (probar con y sin tildes).
- [ ] No hay tarjetas duplicadas.
- [ ] El contador de tarjetas refleja el total esperado.
- [ ] Vista móvil (la mayoría del tráfico será celular): probar con el inspector del navegador en modo responsive.

## 7. Problemas conocidos y detalles a tener en cuenta

- **Bug menor existente**: en la tarjeta 16 (Construcciones Gitzel, `tablero.html` ~línea 841) el `href` dice `5493743455776` pero el `onclick` usa `549374355776` (faltan dígitos). El `onclick` con `return false` es el que manda, pero conviene corregir el `href` para que coincidan.
- Varios `.jpeg` originales conviven con sus versiones `.webp`; las tarjetas usan las `.webp`. Los `.jpeg` son respaldo, no se referencian desde el HTML.
- Las imágenes de tarjeta usan `loading="lazy"`, por lo que el peso individual no es crítico, pero mantener < 200 KB ayuda a la carga inicial del tablero.
- `index.html` y `tablero.html` tienen mucho CSS duplicado/embebido; es intencional (simplicidad), pero cualquier cambio de diseño global se hace en `assets/style.css` y los puntuales en cada página.

## 8. Tablero v2 — administración desde La Fragata

Desde 2026 el tablero se administra **sin editar archivos ni usar git**: todo se hace desde el panel de administración de La Fragata.

**Flujo:**

1. Entrar a `https://lafragata.net/admin/` → sección **🧉 Apóstoles** (solo administradores completos).
2. Alta/edición de tarjetas en **Tarjetas** (con imagen: se convierte sola a WebP ≤1200px; multi-contacto WhatsApp), más pausar/destacar/ordenar/baja lógica.
3. Botón **Publicar**: el sistema genera el tablero, las fichas SEO y los flyers con QR, y los sube a este repositorio por la **API de GitHub** (rama `main`), con lo que GitHub Pages publica solo en 1–2 minutos.
4. También hay descarga de ZIP de respaldo y configuración (`output_file`, `base_url`, `notify_email`, `form_url`) desde el admin. El ZIP incluye las fichas `t/*.html`.

La publicación es LIVE a este repo (`GITHUB_REPO_APOSTOLES=Degochan/apostoles.ar` en La Fragata) y el archivo generado es `tablero.html`. El index conserva su estructura manual, pero su bloque de destacadas se alimenta automáticamente de `datos/tarjetas.json`.

**Solicitudes públicas (2026-08):** el botón **"Sumar mi Tarjeta Gratis"** del tablero abre el formulario `https://lafragata.net/apostoles/solicitar.php` (link secundario a WhatsApp incluido). El vecino carga sus datos; llega un email al admin y la solicitud aparece en **📨 Solicitudes** del panel con badge de pendientes. Al aprobar se crea la tarjeta pausada para revisar, activar y publicar. Nada se publica sin aprobación; el formulario tiene anti-spam (honeypot, time-trap, rate-limit) y las imágenes se re-codifican a WebP.

**Archivos de este repo que pasa a generar el sistema** (no editarlos más a mano una vez en producción):

- `assets/tarjetas/` — imágenes de tarjetas nuevas (WebP ≤1200px) y `flyer-{slug}.png` (PNG horizontal A5 con QR).
- `datos/tarjetas.json` — datos de todas las tarjetas activas.
- `tablero.html` — el tablero completo.
- `t/*.html` — las fichas individuales generadas para las tarjetas activas con slug.
- `sitemap.xml` — con `lastmod` actualizado en cada publicación.

Los archivos que **siguen siendo manuales**: `index.html`, `assets/style.css`, `assets/app.js`, `robots.txt`, `llms.txt`, `CNAME`, `.nojekyll`. El manual completo del admin está en `docs/MANUAL_APOSTOLES_ADMIN.md` del proyecto lafragata.net.

## 9. Respaldos

El repositorio git **es** el respaldo. Recomendaciones:

- Mantener el remote de GitHub actualizado (push después de cada cambio).
- Opcional: agregar un segundo remote o clonar el repo en otro lugar (-drive/disco externo) de vez en cuando: `git clone git@github.com:Degochan/apostoles.ar.git respaldo-apostoles`.
