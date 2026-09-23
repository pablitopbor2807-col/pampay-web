/* ============================================================
   PAMPAY — página de categoría (categoria.html?cat=bodys)
   ============================================================ */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    var params = new URLSearchParams(location.search);
    var catId = params.get("cat") || "bodys";
    var cat = PAMPAY_CATEGORIES.find(function(c){ return c.id === catId; }) || PAMPAY_CATEGORIES[0];

    document.title = "PAMPAY — " + cat.name;
    document.getElementById("crumbName").textContent = cat.name;
    document.getElementById("catTitle").textContent = cat.name;

    var body = document.getElementById("catBody");

    if (cat.active){
      var products = pampayProductsByCategory(cat.id);
      document.getElementById("catSubtitle").textContent = products.length + " producto" + (products.length === 1 ? "" : "s");
      var grid = document.getElementById("catProductGrid");
      grid.innerHTML = products.map(pampayCardHTML).join('');
      pampayWireCards(grid);
    } else {
      document.getElementById("catSubtitle").textContent = "";
      body.innerHTML =
        '<div class="wrap"><div class="coming-soon">' +
          '<h2>Próximamente</h2>' +
          '<p>Estamos preparando ' + cat.name.toLowerCase() + ' para completar tu look PAMPAY. Vuelve pronto.</p>' +
          '<a class="btn primary" href="categoria.html?cat=bodys">Ver Bodys</a>' +
        '</div></div>';
    }
  });
})();
