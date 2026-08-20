# Design: Tablero v2 con Admin ABM en La Fragata y publicación a GitHub Pages

Fecha: 2026-08-20
Repos afectados: `Degochan/apostoles.ar` (este repo) y `Lafragata2` (módulo admin)

## 1. Objetivo

Reemplazar la carga manual de tarjetas del tablero por un sistema de administración (ABM) hospedado en lafragata.net, cuyos datos viven en MySQL, y que al publicar genere un **HTML estático completo** (`tablero2.html`) que se sube a este repo vía GitHub API. El HTML publicado debe contener todas las tarjetas renderizadas en el servidor para SEO óptimo (sin contenido inyectado por JS).

## 2. Decisiones ya tomadas

- El admin vive en lafragata.net (PHP + MySQL existente, dentro de su panel de administración).
- Publicación automática con fine-grained PAT de GitHub guardado en el hosting.
- El diseño de tablero2.html es una **evolución del actual** (identidad morada/verde, misma estructura de secciones) con mejoras de layout, búsqueda y filtros.
- El buscador y los filtros siguen siendo JS del lado del cliente, pero operan sobre tarjetas que ya están en el HTML (progresivo, no requerido para ver el contenido).

## 3. Arquitectura

```
lafragata.net (PHP+MySQL)                    github.com/Degochan/apostoles.ar
┌────────────────────────────┐               ┌─────────────────────────────┐
│ /admin/apostoles.php  ABM  │   Publicar    │ datos/tarjetas.json         │
│ /api/apostoles.php    CRUD │  ──────────►  │ assets/tarjetas/*.webp      │
│ generador: HTML + JSON     │  GitHub API   │ tablero2.html (estático)    │
└────────────────────────────┘               │ → GitHub Pages publica      │
                                             └─────────────────────────────┘
```

Flujo del administrador: login en el panel de La Fragata → pestaña "Apóstoles" → alta/edición/baja de tarjetas y subida de imágenes → botón **"Publicar en apostoles.ar"** → el server genera JSON + HTML y sube los archivos al repo → GitHub Pages publica en 1–2 min.

## 4. Modelo de datos (MySQL, en la DB de La Fragata)

Tabla `apostoles_tarjetas`:

| Campo | Tipo | Notas |
|---|---|---|
| id | INT AUTO_INCREMENT | |
| nombre | VARCHAR(150) | título de la tarjeta |
| categoria | ENUM('profesionales','emprendimientos','empresas','cvs') | |
| descripcion | TEXT | |
| keywords | VARCHAR(500) | minúsculas, sin tildes (para el buscador) |
| imagen | VARCHAR(200) | nombre de archivo en `assets/tarjetas/` |
| imagen_w / imagen_h | INT | dimensiones reales (evita layout shift) |
| contactos | JSON | array `[{nombre?, telefono, mensaje}]` (soporta 1..n botones WhatsApp) |
| destacado | TINYINT(1) | ordena primero |
| orden | INT | orden manual dentro de destacados |
| activo | TINYINT(1) | baja lógica: no se publica |
| created_at / updated_at | DATETIME | |

## 5. Módulo admin (repo Lafragata2)

- `public/admin/apostoles.php` — listado con filtros, acciones editar/activar/destacar/borrar (baja lógica), botón "Publicar".
- `public/admin/apostoles-editor.php` — formulario alta/edición con upload de imagen (reutiliza el flujo de `upload-post-image.php`: valida tipo, redimensiona y convierte a WebP si es posible).
- `public/api/apostoles.php` — CRUD JSON (mismas convenciones de las APIs existentes, protegido por sesión de admin).
- `public/api/apostoles-publish.php` — genera los artefactos y llama a GitHub API (ver §6). Protegido por sesión + confirmación.
- Migración: `public/db/migration_add_apostoles_tarjetas.sql` + importador inicial que parsea las 18 tarjetas actuales de `tablero.html` para partir con los datos existentes.
- Config: `GITHUB_TOKEN_APOSTOLES` y `GITHUB_REPO_APOSTOLES` como variables de entorno del hosting (nunca en el código).

## 6. Generador y publicador (PHP, server-side)

1. Lee todas las tarjetas activas ordenadas (destacados primero, luego `orden`, luego nombre).
2. Genera `datos/tarjetas.json` (fuente de datos/versionado, incluye `updated_at`).
3. Genera `tablero2.html` renderizando cada tarjeta con una plantilla PHP (evolución del markup actual: `tarjeta-card`, `data-category`, `data-keywords`, lightbox, botones WhatsApp). El HTML generado es autocontenido: todo el contenido visible está en el documento sin necesidad de JS.
4. Publica vía GitHub Contents API (`PUT /repos/{repo}/contents/{path}`), un archivo por vez: JSON, imágenes nuevas/modificadas, y `tablero2.html` al final. Actualiza también `sitemap.xml` (lastmod) y mantiene `llms.txt` manual.
5. Respuesta al admin: listado de archivos publicados + link a apostoles.ar/tablero2.html. Errores de API se muestran en el admin y no dejan el repo a medias (se publica el JSON/HTML en el mismo orden: primero imágenes y datos, el HTML siempre último).

Fallback manual: botón "Descargar ZIP" con los archivos generados por si el token falla.

## 7. Diseño tablero2.html (evolución del actual)

Mantiene navbar, footer, paleta y estructura general, con mejoras:

- Grilla más respirada, tarjetas con jerarquía clara (badge de categoría, título, descripción de 3 líneas, botón/es WhatsApp full-width).
- Buscador con contador de resultados visible y estado vacío mejorado.
- Filtros como chips con conteo por categoría.
- Destacados con banda superior morada en la tarjeta.
- Accesibilidad: focus visible, contraste AA, alt descriptivos generados desde `nombre + categoria`.
- Rendimiento: imágenes `loading="lazy"` + `width/height` desde la DB, imágenes convertidas a WebP en el upload.

## 8. Seguridad

- Admin protegido por el login existente de La Fragata (sesión).
- APIs de CRUD y publish: solo sesión admin, métodos POST + CSRF token igual que el resto del panel.
- PAT fine-grained: scope solo `Degochan/apostoles.ar`, permiso únicamente **Contents: read/write**, sin permisos de administración. Expiración definida (ej. 1 año, renovable).
- Upload: validación de MIME real, límite de tamaño (2 MB) y nombre de archivo saneado.

## 9. Manejo de errores

- GitHub API caída o token inválido → mensaje claro en el admin, reintento disponible, nada queda a medias (el HTML se sube último).
- Imagen inválida en upload → rechazo en el editor con mensaje.
- Generación: si no hay tarjetas activas, el publicador se niega a publicar (evita tablero vacío en producción).

## 10. Testing

- Editor local de La Fragata (`lafragata.test`): probar ABM completo, upload, baja lógica, publicador contra un repo de prueba de GitHub.
- Verificación del HTML generado: contiene N tarjetas visibles sin JS (curl + grep), sitemap actualizado, lightbox y filtros funcionan, vista móvil.
- Publicación inicial a apostoles.ar solo después de validar en repo de prueba.

## 11. Alcance (no incluye)

- No se modifica `index.html` (solo un link al tablero v2 si se decide reemplazar el actual).
- No se migran las 18 tarjetas actuales fuera de `tablero.html` hasta validar tablero2.html; luego `tablero.html` queda como respaldo o se redirige.
- No hay usuarios múltiples ni roles nuevos: usa el login existente del panel.
