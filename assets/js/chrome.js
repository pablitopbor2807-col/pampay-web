/* ============================================================
   PAMPAY — comportamiento compartido de header/footer en TODAS las páginas
   (scroll del header, menú móvil, buscador, botón flotante de WhatsApp)
   ============================================================ */
(function(){
  var WHATSAPP_NUMBER = "573023816083";

  function waLink(message){
    var number = WHATSAPP_NUMBER || "573000000000";
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  }
  window.PAMPAY_WA_LINK = waLink;

  document.addEventListener("DOMContentLoaded", function(){
    var genericMsg = "Hola, quiero hacer un pedido en PAMPAY.";
    ["waFloat", "supportWaBtn"].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.setAttribute("href", waLink(genericMsg));
    });

    /* header con sombra al hacer scroll */
    var header = document.querySelector("header.site");
    if (header){
      var onScroll = function(){
        header.classList.toggle("scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive:true });
    }

    /* menú móvil */
    var menuToggle = document.getElementById("menuToggle");
    var mobileMenu = document.getElementById("mobileMenu");
    if (menuToggle && mobileMenu){
      menuToggle.addEventListener("click", function(){
        mobileMenu.classList.toggle("open");
      });
    }

    /* marcar link activo del menú según categoría actual */
    var params = new URLSearchParams(location.search);
    var currentCat = params.get("cat");
    document.querySelectorAll("nav.links a, .mobile-menu a").forEach(function(a){
      var linkCat = a.getAttribute("data-cat");
      if (linkCat && linkCat === currentCat) a.classList.add("active");
    });

    /* buscador */
    var searchToggle = document.getElementById("searchToggle");
    var searchPanel = document.getElementById("searchPanel");
    var searchInput = document.getElementById("searchInput");
    var searchResults = document.getElementById("searchResults");
    if (searchToggle && searchPanel){
      searchToggle.addEventListener("click", function(){
        searchPanel.classList.toggle("open");
        if (searchPanel.classList.contains("open") && searchInput) searchInput.focus();
      });
    }
    if (searchInput && searchResults && typeof PAMPAY_PRODUCTS !== "undefined"){
      searchInput.addEventListener("input", function(){
        var q = searchInput.value.trim().toLowerCase();
        if (!q){ searchResults.innerHTML = ""; return; }
        var matches = PAMPAY_PRODUCTS.filter(function(p){
          return p.name.toLowerCase().indexOf(q) !== -1;
        }).slice(0, 8);
        if (matches.length === 0){
          searchResults.innerHTML = '<p class="search-empty">Sin resultados para "' + searchInput.value + '"</p>';
          return;
        }
        searchResults.innerHTML = matches.map(function(p){
          var img = (p.colors.find(function(c){return c.img;}) || {}).img || "";
          return '<a href="producto.html?id=' + p.id + '">' +
            (img ? '<img src="' + img + '" alt="">' : '') +
            '<span>' + p.name + ' — $' + p.price.toLocaleString("es-CO") + '</span></a>';
        }).join('');
      });
    }

    /* icono de cuenta: sin login todavía, lleva a contacto por WhatsApp */
    var accountBtn = document.getElementById("accountBtn");
    if (accountBtn){
      accountBtn.addEventListener("click", function(){
        window.open(waLink("Hola, tengo una pregunta sobre mi pedido en PAMPAY."), "_blank");
      });
    }
  });
})();
