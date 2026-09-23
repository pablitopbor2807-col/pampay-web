// Categorías de la tienda. "active:false" = próximamente (sin productos cargados aún).
var PAMPAY_CATEGORIES = [
  { id: "bodys", name: "Bodys", active: true, img: "assets/img/productos/cruzado-grecia-azul.jpg" },
  { id: "conjuntos", name: "Conjuntos", active: false, img: "assets/img/productos/top-manga-larga-rosa.jpg" },
  { id: "calzado", name: "Calzado", active: false, img: null },
  { id: "bolsos", name: "Bolsos", active: false, img: null },
  { id: "sale", name: "Sale", active: false, img: null }
];

// Productos. Textos, precios y colores originales sin modificar — solo se agregó
// "category" (para el menú/páginas de categoría) y "tag" (solo en productos donde es honesto: recién agregados).
var PAMPAY_PRODUCTS = [
  {
    id: "top-manga-larga-zadel",
    name: "Body Top Manga Larga Zadel",
    price: 49000,
    category: "bodys",
    detail: "Tela Mayatex y top tela Polilycra. Talla única (M-L). Top interno cosido.",
    colors: [
      { name: "Rosa", hex: "#E7A6B0", img: "assets/img/productos/top-manga-larga-rosa.jpg" },
      { name: "Azul", hex: "#9FC2DE", img: "assets/img/productos/top-manga-larga-azul.jpg" },
      { name: "Amarillo", hex: "#EAD97C", img: "assets/img/productos/top-manga-larga-amarillo.jpg" }
    ]
  },
  {
    id: "blonda-espalda-zadel",
    name: "Body Blonda Espalda Zadel",
    price: 54000,
    category: "bodys",
    detail: "Tela Blonda con espalda descubierta. Talla única (M-L). Trae top interno cosido.",
    colors: [
      { name: "Blanco", hex: "#F3EFE9", img: "assets/img/productos/blonda-espalda-blanco.jpg" },
      { name: "Negro", hex: "#2A2622", img: "assets/img/productos/blonda-espalda-negro.jpg" }
    ]
  },
  {
    id: "transparencia-escote",
    name: "Body Transparencia Escote",
    price: 49000,
    category: "bodys",
    detail: "Tiene strech. Talla única (M-L, no muy troza).",
    colors: [
      { name: "Blanco", hex: "#F3EFE9", img: "assets/img/productos/transparencia-escote-blanco.jpg" },
      { name: "Negro", hex: "#2A2622", img: "assets/img/productos/transparencia-escote-negro.jpg" },
      { name: "Beige", hex: "#CBAF95", img: null },
      { name: "Café", hex: "#6B4A38", img: null },
      { name: "Mostaza", hex: "#C9A63F", img: null },
      { name: "Rojo", hex: "#A6332E", img: null },
      { name: "Vinotinto", hex: "#6E2430", img: null }
    ]
  },
  {
    id: "corset-blonda",
    name: "Corset Blonda",
    price: 82000,
    category: "bodys",
    detail: "Graduable en la espalda. Varillas internas y copa (talla 34 a 36). Talla única (M-L).",
    colors: [
      { name: "Blanco", hex: "#F3EFE9", img: "assets/img/productos/corset-blonda-blanco.jpg" },
      { name: "Negro", hex: "#2A2622", img: null }
    ]
  },
  {
    id: "manga-larga-mayatex",
    name: "Body Manga Larga Mayatex",
    price: 49000,
    category: "bodys",
    detail: "Tiene strech. Talla única (M, no muy troza). Prenda delicada.",
    colors: [
      { name: "Azul", hex: "#5F84B0", img: "assets/img/productos/manga-larga-mayatex-azul.jpg" },
      { name: "Rojo", hex: "#A6332E", img: "assets/img/productos/manga-larga-mayatex-rojo.jpg" },
      { name: "Blanco", hex: "#F3EFE9", img: null },
      { name: "Beige", hex: "#CBAF95", img: null },
      { name: "Negro", hex: "#2A2622", img: null },
      { name: "Vinotinto", hex: "#6E2430", img: null },
      { name: "Café", hex: "#6B4A38", img: null },
      { name: "Amarillo", hex: "#EAD97C", img: null }
    ]
  },
  {
    id: "picapiedra-tira",
    name: "Body Picapiedra Tira",
    price: 42000,
    category: "bodys",
    detail: "Tiene strech. Talla única (M-L).",
    colors: [
      { name: "Blanco", hex: "#F3EFE9", img: null },
      { name: "Rojo", hex: "#A6332E", img: null },
      { name: "Café", hex: "#6B4A38", img: null }
    ]
  },
  {
    id: "cruzado-grecia-zadel",
    name: "Body Cruzado Grecia Zadel",
    price: 42000,
    category: "bodys",
    tag: "Nuevo",
    detail: "Polilycra doble tela con nudo cruzado. Talla única (hasta M-L). Prenda íntima, sin cambio.",
    colors: [
      { name: "Azul", hex: "#2436A8", img: "assets/img/productos/cruzado-grecia-azul.jpg" },
      { name: "Blanco", hex: "#F3EFE9", img: "assets/img/productos/cruzado-grecia-blanco.jpg" },
      { name: "Café", hex: "#6B4A38", img: "assets/img/productos/cruzado-grecia-cafe.jpg" }
    ]
  },
  {
    id: "transparencia-silueta",
    name: "Body Transparencia Silueta",
    price: 49000,
    category: "bodys",
    tag: "Nuevo",
    detail: "Tiene strech, manga larga en malla transparente. Talla única (hasta M-L, no muy troza). Prenda íntima, sin cambio.",
    colors: [
      { name: "Negro", hex: "#2A2622", img: "assets/img/productos/transparencia-silueta-negro.jpg" }
    ]
  }
];

function pampayFindProduct(id){
  for (var i=0;i<PAMPAY_PRODUCTS.length;i++){
    if (PAMPAY_PRODUCTS[i].id === id) return PAMPAY_PRODUCTS[i];
  }
  return null;
}

function pampayProductsByCategory(catId){
  return PAMPAY_PRODUCTS.filter(function(p){ return p.category === catId; });
}
