/* =====================================================================
   Llampayec · configuración del flipbook
   ---------------------------------------------------------------------
   La revista final (56 páginas) viene con todas las imágenes ya
   integradas, así que no hay huecos ("slots") pendientes.
   Si algún día hace falta superponer una imagen o un video sobre una
   página, agrega un hueco en "slots":
        { id: 'p05-foto', page: 5, rect: [x, y, ancho, alto], label: '...',
          src: 'assets/media/archivo.jpg' }          (imagen o video .mp4)
   rect = [x, y, ancho, alto] en píxeles sobre la página de 1398 × 2000.
   Para ver los huecos marcados abre la revista con  ?slots=1
   ===================================================================== */
window.LLAMPAYEC = {
  title: 'Llampayec · Revista cultural musical · Edición Nº 01',
  pageCount: 56,
  pageSize: { w: 1398, h: 2000 },
  pageImage:  n => `assets/web/p${n}.webp`,
  thumbImage: n => `assets/thumbs/p${n}.jpg`,

  pageTitles: {
    1: 'Portada', 2: 'Índice', 3: 'Página de imagen',
    4: 'Editorial · ¿Conocemos realmente la música de nuestra región?', 5: 'Página de imagen',
    6: '¿Qué es el criollismo lambayecano?', 7: 'El criollismo lambayecano (continuación)',
    8: 'Memoria de grandes maestros',
    9: 'Luis Abelardo Takahashi Núñez · El compositor ilustre', 10: 'De Ferreñafe a la capital',
    11: 'El «sabor norteño» de sus composiciones', 12: 'La historia detrás de sus canciones',
    13: 'El reconocimiento de una generación',
    14: 'José Escajadillo Farro · El poeta que convirtió los sentimientos en valses', 15: 'Su migración hacia Lima',
    16: '«Jamás impedirás», una canción que cambió su historia', 17: 'El vals y las historias detrás de sus canciones',
    18: 'Una trayectoria que transcendió fronteras', 19: 'El reconocimiento de su tierra',
    20: 'Agrupación de grandes voces',
    21: 'Achica, achica, mochica · El sonido del norte', 22: 'Nicolás Seclén, el rostro de una tradición norteña',
    23: 'De la esquina del movimiento a los escenarios', 24: '¡Achica, achica, Mochica!',
    25: 'Canciones que llevaron el nombre de Lambayeque más allá de sus fronteras', 26: 'Un siglo de Nicolás Seclén, memoria y legado',
    27: 'El palacio de las memorias musicales', 28: 'Casa Cobos · Cuando Chiclayo también grababa su música',
    29: 'El sonido del norte tuvo su casa', 30: 'Discos que cuentan una historia', 31: 'Una etapa que terminó, una casa que sigue',
    32: 'La jarana continúa', 33: 'Un recorrido musical por Lambayeque',
    34: 'Instrumentos', 35: 'Instrumentos que cuentan nuestra historia · Cuerdas',
    36: 'Instrumentos · Percusión', 37: 'Instrumentos · Viento',
    38: 'Sonidos que cuentan nuestra historia', 39: 'Pedro Bardales Malaver',
    40: 'Yim Sampértegui', 41: 'Yim Sampértegui (continuación)',
    42: '«Sonidos de Lambayeque» · Un proyecto que nace de una inquietud', 43: 'Sonidos de Lambayeque (continuación)', 44: 'Sonidos de Lambayeque (continuación)',
    45: 'César Chima', 46: 'César Chima (continuación)', 47: 'César Chima (continuación)',
    48: 'Manuel de la Cruz', 49: 'Manuel de la Cruz (continuación)', 50: 'Manuel de la Cruz (continuación)',
    51: 'Música y actualidad · ¿Cómo se difunde la música lambayecana hoy?', 52: 'Cinco claves para su futuro',
    53: 'Lambayeque sigue sonando', 54: 'Una memoria que continúa', 55: 'Créditos', 56: 'Contraportada'
  },

  sections: [
    { title: 'Portada e índice',                          pages: [1, 2, 3] },
    { title: 'Editorial',                                 pages: [4, 5] },
    { title: '¿Qué es el criollismo lambayecano?',        pages: [6, 7] },
    { title: 'Memoria de grandes maestros',               pages: [8] },
    { title: 'Luis Abelardo Takahashi Núñez',             pages: [9, 10, 11, 12, 13] },
    { title: 'José Escajadillo Farro',                    pages: [14, 15, 16, 17, 18, 19] },
    { title: 'Agrupación de grandes voces',               pages: [20] },
    { title: 'Los Mochicas',                              pages: [21, 22, 23, 24, 25, 26] },
    { title: 'El palacio de las memorias musicales',      pages: [27] },
    { title: 'Casa Cobos',                                pages: [28, 29, 30, 31] },
    { title: 'La jarana continúa',                        pages: [32, 33] },
    { title: 'Instrumentos que cuentan nuestra historia', pages: [34, 35, 36, 37] },
    { title: 'Sonidos que cuentan nuestra historia',      pages: [38] },
    { title: 'Pedro Bardales Malaver',                    pages: [39] },
    { title: 'Yim Sampértegui',                           pages: [40, 41] },
    { title: 'Sonidos de Lambayeque',                     pages: [42, 43, 44] },
    { title: 'César Chima',                               pages: [45, 46, 47] },
    { title: 'Manuel de la Cruz',                         pages: [48, 49, 50] },
    { title: 'Música y actualidad',                       pages: [51, 52, 53] },
    { title: 'Una memoria que continúa',                  pages: [54] },
    { title: 'Créditos y contraportada',                  pages: [55, 56] }
  ],

  /* Sin huecos: las imágenes ya están dentro de las páginas. */
  slots: []
};