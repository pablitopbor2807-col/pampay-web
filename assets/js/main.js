/* ============================================================
   PAMPAY — lógica específica del home (index.html)
   ============================================================ */
(function(){
  document.addEventListener("DOMContentLoaded", function(){

    /* ---------- categorías ---------- */
    var catGrid = document.getElementById("categoryGrid");
    if (catGrid){
      catGrid.innerHTML = PAMPAY_CATEGORIES.filter(function(c){ return c.id !== "sale"; }).map(function(c){
        if (c.active){
          return '<a class="cat-card" href="categoria.html?cat=' + c.id + '">' +
            '<img src="' + c.img + '" alt="' + c.name + '">' +
            '<span class="cat-label">' + c.name + '</span></a>';
        }
        return '<a class="cat-card soon" href="categoria.html?cat=' + c.id + '">' +
          '<span class="cat-label">' + c.name + '</span>' +
          '<div class="soon-badge">Próximamente</div></a>';
      }).join('');
    }

    /* ---------- nuevos lanzamientos (carrusel) ---------- */
    var carousel = document.getElementById("newLaunches");
    if (carousel){
      var nuevos = PAMPAY_PRODUCTS.filter(function(p){ return p.tag === "Nuevo"; });
      var resto = PAMPAY_PRODUCTS.filter(function(p){ return p.tag !== "Nuevo"; });
      var lista = nuevos.concat(resto).slice(0, 8);
      carousel.innerHTML = lista.map(pampayCardHTML).join('');
      pampayWireCards(carousel);

      var prevBtn = document.getElementById("carouselPrev");
      var nextBtn = document.getElementById("carouselNext");
      if (prevBtn && nextBtn){
        var scrollAmount = function(){ return carousel.clientWidth * 0.8; };
        prevBtn.addEventListener("click", function(){ carousel.scrollBy({ left: -scrollAmount(), behavior:"smooth" }); });
        nextBtn.addEventListener("click", function(){ carousel.scrollBy({ left: scrollAmount(), behavior:"smooth" }); });
      }
    }

    /* ---------- más vendidos ---------- */
    var bestsellers = document.getElementById("bestsellersGrid");
    if (bestsellers){
      var picks = PAMPAY_PRODUCTS.filter(function(p){ return p.tag !== "Nuevo"; }).slice(0, 4);
      bestsellers.innerHTML = picks.map(pampayCardHTML).join('');
      pampayWireCards(bestsellers);
    }

    /* ---------- arma tu outfit ---------- */
    var outfitPhoto = document.getElementById("outfitPhoto");
    var outfitBodyItem = document.getElementById("outfitBodyItem");
    var outfitBuyBtn = document.getElementById("outfitBuyBtn");
    var outfitProduct = pampayFindProduct("cruzado-grecia-zadel");
    if (outfitProduct && outfitPhoto && outfitBodyItem){
      var color = outfitProduct.colors.find(function(c){ return c.img; }) || outfitProduct.colors[0];
      outfitPhoto.src = color.img;
      outfitPhoto.alt = outfitProduct.name;
      outfitBodyItem.innerHTML =
        '<img src="' + color.img + '" alt="' + outfitProduct.name + '">' +
        '<div><div class="oi-name">' + outfitProduct.name + '</div>' +
        '<div class="oi-price">$' + outfitProduct.price.toLocaleString("es-CO") + '</div></div>';
      if (outfitBuyBtn){
        outfitBuyBtn.addEventListener("click", function(){
          PampayCart.addItem(outfitProduct.id, color.name, 1);
        });
      }
    }

    /* ---------- newsletter ---------- */
    var newsForm = document.getElementById("newsletterForm");
    if (newsForm){
      newsForm.addEventListener("submit", function(e){
        e.preventDefault();
        var email = document.getElementById("newsletterEmail").value.trim();
        if (!email) return;
        var msg = "Hola, quiero mi 10% de descuento de bienvenida a PAMPAY. Mi correo es: " + email;
        window.open(PAMPAY_WA_LINK(msg), "_blank");
        newsForm.reset();
        PampayCart.showToast("¡Gracias! Te escribimos por WhatsApp para tu código.");
      });
    }
  });
})();
