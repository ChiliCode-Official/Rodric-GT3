# Rodric GT3 — Porsche 3D

Sitio estático para GitHub Pages. Conserva las cuatro secciones, colores, tipografías, navegación fija y transiciones 3D del ejemplo `3D Realistic Bee`. El Porsche cambia de encuadre al desplazarse. No requiere React, npm, backend ni compilación.

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
- `script.js`: escena y cuatro vistas en `views`. `angle` gira el auto, `scale` cambia su tamaño y `x`/`y` su posición.
- `assets/porsche_gt3_rs.glb`: modelo local de aproximadamente 18.4 MB.
- `assets/vendor/`: Three.js 0.160.1 y cargador locales.
- `.nojekyll`: permite servir directamente los archivos estáticos.

Para previsualizar localmente usa un servidor HTTP, por ejemplo **Live Server** de VS Code y **Open with Live Server** sobre `index.html`. No uses doble clic: los módulos y el GLB requieren HTTP.

La carpeta `3D Realistic Bee` conserva la referencia sin modificaciones. `linker-original.html` conserva la portada anterior. Los archivos antiguos no intervienen en la portada nueva.

## Recursos y rendimiento

El modelo y Three.js se sirven desde el propio repositorio. Las fuentes de la referencia se cargan desde CDNFonts, con alternativas locales si falla la conexión. El render se detiene al terminar cada transición y al ocultar la pestaña, limita la densidad a 1.5 y respeta movimiento reducido. No hay seguimiento ni formularios que guarden datos.

Modelo: **Porsche GT3 RS**, por **Black Snow**, licencia **CC BY 4.0**. Fuente y atribución también incluidas en el pie de página:
https://sketchfab.com/3d-models/porsche-gt3-rs-e738eae819c34d19a31dd066c45e0f3d

Se ha adaptado la presentación y la animación; el archivo GLB se conserva sin modificar. Diseño de referencia: `3D Realistic Bee`, @CodeZenithAI. Sitio independiente, no afiliado a Porsche.
