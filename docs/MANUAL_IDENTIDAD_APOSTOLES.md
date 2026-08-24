# Manual de identidad visual — Apóstoles.ar

Este manual define qué versión del kit de marca se usa en cada contexto del
sitio. La fuente oficial es `assets/marca/`: los SVG están en `kit/` y los
exportes PNG finales en `png-final/`.

## Regla general

La identidad combina el mate, el nombre **APÓSTOLES**, la bajada
**CARTELERA DE APÓSTOLES · APOSTOLES.AR** y la regla tricolor. No se deben
mezclar variantes, deformar el logo ni agregar efectos que alteren sus
proporciones.

## Qué archivo usar

| Contexto | Archivo | Criterio |
|---|---|---|
| Navbar sobre fondo claro | `kit/10-navbar-compacto-oscuro.svg` | Logo compacto con texto oscuro |
| Navbar o footer sobre fondo oscuro | `kit/09-navbar-compacto-blanco.svg` | Logo compacto claro |
| Hero sobre violeta o imagen oscura | `kit/08-horizontal-transparente.svg` | Logo horizontal con bajada y regla |
| Favicon del navegador | `png-final/favicon-transparent-32.png` o `favicon-transparent-64.png` | Mate recortado, transparente, con bombilla violeta |
| Apple Touch Icon | `png-final/apple-touch-icon-180.png` | Ícono para dispositivos Apple |
| Open Graph institucional | `png-final/placa-social-1280x720.png` | Inicio y tablero |
| Banner web amplio | `png-final/banner-1920x480.png` | Banners o cabeceras especiales |
| Imagen de ficha individual | `assets/tarjetas/og-{slug}.png` | Foto del local + logo institucional |
| Marca mínima | `png-final/escudo-recortado.png` | Esquinas, fondos o espacios reducidos |

## Aplicación actual

- `index.html`: navbar, hero, footer, favicon y Open Graph institucional.
- `tablero.html`: se genera desde La Fragata con navbar, hero, footer, favicon
  y Open Graph institucional.
- `t/{slug}.html`: se genera desde La Fragata con logo en la cabecera, favicon
  y una imagen Open Graph propia del local.
- Imágenes `Estoy en Apóstoles` y flyers: mantienen el diseño funcional y
  llevan la marca mínima del escudo.

## Imagen compartida de una ficha

Cuando una tarjeta tiene slug, la ficha usa `og-{slug}.png` como `og:image`.
La composición coloca la imagen del comercio como protagonista y el logo de
Apóstoles en el bloque de marca. Si la fuente original no está disponible, la
ficha conserva como fallback la imagen original de la tarjeta.

Estas imágenes se generan y publican desde el CMS. No editar a mano los PNG
generados dentro de `assets/tarjetas/`.

## Paleta de referencia

- Violeta profundo: `#3C018F`
- Violeta brillante: `#7B29EF`
- Cian: `#5AF2E5`
- Rojo de la regla: `#DF0000`
- Verde de la regla: `#008000`
- Oscuro de texto/fondos: `#12102A`

## Tipografía y usos

- **Montserrat Black**: nombre principal y títulos de marca, siempre en
  mayúsculas cuando lo indique el arte final.
- **Inter SemiBold**: bajadas, etiquetas y textos de apoyo.
- Respetar el aire alrededor del logo, no rotarlo, no estirarlo y no cambiar
  sus colores internos.

## Antes de agregar una pieza nueva

1. Elegir la variante según el fondo y el espacio disponible.
2. Mantener la proporción original del archivo.
3. Preferir SVG para interfaz y PNG final para metadatos o redes.
4. Agregar `alt` descriptivo en toda imagen visible.
5. Si la pieza se genera desde el CMS, incorporarla al publicador y no editar
   el HTML estático manualmente.
