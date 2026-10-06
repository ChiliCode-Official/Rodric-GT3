# Rodric GT3 — Portafolio de fotografía y diseño web

Sitio estático para GitHub Pages. Conserva las cuatro secciones, tipografías y navegación fija del ejemplo `3D Realistic Bee`. La paleta combina blanco, grafito y rojo con el Porsche. El giro, la inclinación y el encuadre avanzan de forma continua con el desplazamiento; retroceden al subir. No requiere React, npm, backend ni compilación.

## Publicar paso a paso

1. Abre GitHub Desktop y selecciona **Rodric-GT3**.
2. En **Changes**, revisa los archivos. Escribe `Sitio Porsche 3D` en **Summary**.
3. Pulsa **Commit to main** (o el nombre de tu rama) y después **Push origin**.
4. En GitHub, abre el repositorio y entra a **Settings → Pages**.
5. En **Source**, selecciona **Deploy from a branch**.
6. Selecciona la rama que subiste y la carpeta **/ (root)**. Pulsa **Save**.
7. Espera a que GitHub muestre el enlace de tu sitio. Ábrelo.

## Editar desde GitHub, sin instalar nada

1. Abre `index.html` en el repositorio.
2. Pulsa el lápiz **Edit this file**.
3. Busca el texto visible que deseas cambiar, por ejemplo `Pasión sin límite.`. Cambia solamente ese texto; conserva las etiquetas que lo rodean.
4. Para cambiar una red, modifica su dirección entre las comillas de `href` y el nombre que aparece después.
5. Pulsa **Commit changes**. GitHub Pages publicará la actualización.

Archivos:
- `index.html`: títulos, párrafos, redes y contacto.
- `style.css`: diseño original y ajustes al final. Los colores están en `:root`.
- `script.js`: escena y cuatro vistas en `views`. `angle` gira el auto, `pitch` ajusta la inclinación, `scale` cambia su tamaño y `x`/`y` su posición.
- `assets/porsche_gt3_rs.optimized.glb`: modelo servido de 3.04 MB, con Meshopt y texturas WebP de hasta 1024 px.
- `assets/porsche_gt3_rs.glb`: original de 19.27 MB conservado como respaldo; no se descarga en la portada.
- `assets/vendor/`: Three.js 0.160.1 y cargador locales.
- `.nojekyll`: permite servir directamente los archivos estáticos.

Para previsualizar localmente usa un servidor HTTP, por ejemplo **Live Server** de VS Code y **Open with Live Server** sobre `index.html`. No uses doble clic: los módulos y el GLB requieren HTTP.

La carpeta `3D Realistic Bee` conserva la referencia sin modificaciones. `linker-original.html` conserva la portada anterior. Los archivos antiguos no intervienen en la portada nueva.

## Recursos y rendimiento

El modelo y Three.js se sirven desde el propio repositorio. Las fuentes de la referencia se cargan desde CDNFonts, con alternativas locales si falla la conexión. El render se detiene al terminar cada transición y al ocultar la pestaña, limita la densidad a 1.5 y respeta movimiento reducido. No hay seguimiento ni formularios que guarden datos.

Modelo: **Porsche GT3 RS**, por **Black Snow**, licencia **CC BY 4.0**. Fuente y atribución también incluidas en el pie de página:
https://sketchfab.com/3d-models/porsche-gt3-rs-e738eae819c34d19a31dd066c45e0f3d

Se ha adaptado la presentación y la animación. El GLB utilizado se optimizó con glTF Transform: deduplicación, unión de piezas, compresión Meshopt, cuantización y texturas WebP. Se conservó el original. No se simplificó la geometría. Diseño de referencia: `3D Realistic Bee`, @CodeZenithAI. Sitio independiente, no afiliado a Porsche.

## Portafolio

Los enlaces de Instagram, TikTok y perfil personal están al inicio en `.bio-links`. La sección `intro` presenta la fotografía y el proyecto Camilo Guerra; `description` presenta el servicio de páginas web y la certificación UX indicada por el propietario. Para actualizar el proyecto, edita el enlace `.project-link` en `index.html`. El contacto abre el correo del visitante.

La optimización redujo la descarga del GLB de 19,270,544 a 3,038,400 bytes (84.2%) y los grupos de dibujo de 291 a 23. Esto reduce transferencia y trabajo de render; la duración real depende de la conexión y el dispositivo. Meshopt y su decodificador se sirven localmente.

### Versión de carga rápida

La portada usa `assets/porsche_gt3_rs.fast.glb` (aproximadamente 1.67 MB). La versión anterior de 3.04 MB se conserva. Se simplificó geometría con límite de error de 0.001 y se limitaron texturas a 512 px, reduciendo detalle fino a cambio de menor descarga y trabajo del navegador. El modelo y los módulos se precargan desde la cabecera. El render limita la densidad a 1 en móvil y 1.25 en escritorio.
