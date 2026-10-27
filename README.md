# Tramoya · video explicativo

Qué es Tramoya, para qué sirve y cómo se usa, hecho con [Tramoya](https://github.com/CaseresMaxi/tramoya) (estilo «brutalista», tema negro ácido).
Salió de `tramoya nuevo tramoya-video` y solo cambia `proyecto/`.

| Qué | Dónde |
|-----|-------|
| Video final (4 min 40 s, 1080p) | [Descargar `tramoya-explicado.mp4`](https://github.com/CaseresMaxi/tramoya-video/releases/latest/download/tramoya-explicado.mp4) · o se genera en `salida/` |
| Presentación (para presentarla en vivo) | `motion/index.html` · → avanza, N muestra las notas |
| Guion para grabar la voz | `guion.md` (las notas de cada escena) |
| Escenas | `proyecto/escenas.js` (lo editado en el navegador, en `proyecto/estado/motion.json`, manda sobre este archivo) · capturas reales en `proyecto/assets/img/cap-*.webp` |
| Tipo «captura» (pantalla con marcas numeradas) | `proyecto/tipos.js` |

Para cambiarlo: `node herramientas/tramoya.mjs estudio` (o tecla E en la presentación).
Para volver a exportar: `tramoya video motion --pausaMax 4 --fps 30 --sub 2 --salida tramoya-explicado.mp4`.
Otro look: `tramoya estilo <id>` (lista: `tramoya estilos`) y volver a exportar.

Licencia: el motor es de Tramoya ([PolyForm Noncommercial 1.0.0](LICENCIA.md); uso comercial con licencia del autor). El contenido del video es del autor.
