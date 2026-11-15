/* =====================================================================
   Llampayec · configuración del flipbook
   ---------------------------------------------------------------------
   CÓMO COLOCAR UNA IMAGEN O UN VIDEO EN UN HUECO
   1. Copia el archivo a la carpeta  assets/media/
   2. En el hueco que corresponda (ver "slots" abajo) escribe su ruta en "src":
        src: 'assets/media/takahashi-portada.jpg'      (imagen)
        src: 'assets/media/entrevista.mp4'             (video)
      Opcional en videos:  poster: 'assets/media/entrevista-poster.jpg'
   Mientras "src" sea null, el hueco es invisible y la página se ve
   exactamente como en Canva.

   rect = [x, y, ancho, alto] en píxeles sobre la página original de 1398 × 2000.
   Para ver todos los huecos marcados abre la revista con  ?slots=1
   ===================================================================== */
window.LLAMPAYEC = {
  title: 'Llampayec · Revista cultural musical · Edición Nº 01',
  pageCount: 33,
  pageSize: { w: 1398, h: 2000 },
  pageImage:  n => `assets/web/p${n}.webp`,
  thumbImage: n => `assets/thumbs/p${n}.jpg`,

  pageTitles: {
    1: 'Portada', 2: 'Página de imagen', 3: '¿Conocemos realmente la música de nuestra región?',
    4: 'Página de imagen', 5: '¿Qué es el criollismo lambayecano?', 6: 'El criollismo lambayecano (continuación)',
    7: 'Página de imagen', 8: 'Memoria de grandes maestros', 9: 'Luis Abelardo Takahashi Núñez',
    10: 'El compositor ilustre detrás de grandes éxitos', 11: 'De Ferreñafe a la capital',
    12: 'El «sabor norteño» de sus composiciones', 13: 'La historia detrás de sus canciones',
    14: 'El reconocimiento de una generación', 15: 'José Escajadillo Farro',
    16: 'El poeta que convirtió los sentimientos en valses', 17: 'Su migración hacia Lima',
    18: '«Jamás impedirás», una canción que cambió su historia', 19: 'El vals y las historias detrás de sus canciones',
    20: 'Una trayectoria que transcendió fronteras', 21: 'El reconocimiento de su tierra',
    22: 'Los Mochicas', 23: 'Achica, achica, mochica · El sonido del norte',
    24: 'Nicolás Seclén, el rostro de una tradición norteña', 25: 'De la esquina del movimiento a los escenarios',
    26: 'Achica, achica, Mochica', 27: 'Página de imagen',
    28: 'Música y actualidad · ¿Cómo se difunde la música lambayecana hoy?', 29: 'Cinco claves para su futuro',
    30: 'Instrumentos que cuentan nuestra historia · Cuerdas', 31: 'Instrumentos · Percusión', 32: 'Instrumentos · Viento',
    33: 'El banjo en la música criolla'
  },

  sections: [
    { title: 'Presentación',                          pages: [1, 2, 3, 4] },
    { title: '¿Qué es el criollismo lambayecano?',    pages: [5, 6] },
    { title: 'Memoria de grandes maestros',           pages: [7, 8] },
    { title: 'Luis Abelardo Takahashi Núñez',         pages: [9, 10, 11, 12, 13, 14] },
    { title: 'José Escajadillo Farro',                pages: [15, 16, 17, 18, 19, 20, 21] },
    { title: 'Los Mochicas',                          pages: [22, 23, 24, 25, 26, 27] },
    { title: 'Música y actualidad',                   pages: [28, 29] },
    { title: 'Instrumentos que cuentan nuestra historia', pages: [30, 31, 32] },
    { title: 'El banjo en la música criolla',         pages: [33] }
  ],

  /* HUECOS DE IMAGEN / VIDEO (medidos sobre los placeholders de Canva).
     "textLayer": (opcional) ruta de una imagen transparente con el título de la página,
     para que quede ENCIMA de la foto. Se usa en las páginas 9, 15 y 22, cuyo título
     está dibujado sobre el placeholder. */
  slots: [
    { id: 'p02-pagina-completa', page: 2,  rect: [0, 0, 1398, 2000],     label: 'Imagen a página completa',                 src: null },
    { id: 'p04-pagina-completa', page: 4,  rect: [0, 0, 1398, 2000],     label: 'Imagen a página completa',                 src: null },
    { id: 'p05-criollismo',      page: 5,  rect: [687, 380, 657, 1286],  label: 'Imagen vertical del criollismo',           src: null },
    { id: 'p06-criollismo',      page: 6,  rect: [59, 807, 1276, 857],   label: 'Imagen horizontal del criollismo',         src: null },
    { id: 'p07-pagina-completa', page: 7,  rect: [0, 0, 1398, 2000],     label: 'Imagen a página completa',                 src: null },
    { id: 'p09-takahashi',       page: 9,  rect: [0, 0, 1398, 2000],     label: 'Portada de Luis Abelardo Takahashi Núñez', src: 'assets/media/takahashi-portada.jpg', pos: '44% 50%', textLayer: 'assets/web/p09-text.webp', textLight: true },
    { id: 'p15-escajadillo',     page: 15, rect: [0, 0, 1398, 2000],     label: 'Portada de José Escajadillo Farro',        src: 'assets/media/escajadillo-portada.jpg', textLayer: 'assets/web/p15-text.webp', textLight: true },
    { id: 'p22-mochicas',        page: 22, rect: [0, 0, 1398, 2000],     label: 'Portada de Los Mochicas',                  src: null, textLayer: 'assets/web/p22-text.webp' },
    { id: 'p31-checo',           page: 31, rect: [100, 1093, 283, 363],  label: 'Foto del checo (instrumento de percusión)', src: null, fit: 'contain', radius: '50% 50% 7% 7% / 39% 39% 5.5% 5.5%' },
    { id: 'p26-mochica',         page: 26, rect: [749, 61, 554, 1073],   label: 'Imagen vertical de Los Mochicas',          src: null }
  ]
};
