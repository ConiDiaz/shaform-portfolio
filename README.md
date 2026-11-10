# SHAFORM — Portafolio personal

Sitio web estático para presentar el portafolio de diseño gráfico y branding de Constanza Díaz Olguín.
El proyecto está estructurado como un repositorio único con varias páginas temáticas:

- Inicio: `Inicio-html/Main.dc.html`
- Proyectos: `Proyectos-html/Proyectos.dc.html`
- Sobre mí: `Sobre mí-html/SobreMi.dc.html`
- Hablemos: `Hablemos-html/Hablemos.dc.html`
- Fichas individuales de proyectos: `Proyecto.dc.html`
- Contenido compartido de los proyectos: `project-data.js`

La galería y las fichas individuales usan los registros de `project-data.js`.
Cada enlace añade el identificador del proyecto en la URL (por ejemplo,
`Proyecto.dc.html?proyecto=thanatos`). Las imágenes se referencian por nombre
de archivo dentro de `Proyectos-html/assets/`; las galerías admiten imágenes,
texto alternativo, pies de foto y una posición de grilla opcional.

## Vista previa local

Desde la carpeta raíz del repositorio:

```bash
python -m http.server 8000
```

Luego abre:

- `http://localhost:8000/`
- o directamente cualquiera de las páginas dentro de las carpetas

## Navegación

Todas las páginas están enlazadas entre sí para facilitar la navegación dentro del portafolio y la experiencia visual del sitio.

## Público

Este repositorio ha sido preparado para publicarse en GitHub como proyecto abierto.
