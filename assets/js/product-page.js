/* ============================================================
   PAMPAY — página de producto (producto.html?id=...)
   ============================================================ */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var product = pampayFindProduct(id) || PAMPAY_PRODUCTS[0];
    var qty = 1;
    var activeColor = (product.colors.find(function(c){ return c.img; }) || product.colors[0]).name;

    document.title = "PAMPAY — " + product.name;
    document.getElementById("crumbName").textContent = product.name;
    document.getElementById("pdpName").textContent = product.name;
    document.getElementById("pdpPrice").textContent = "$" + product.price.toLocaleString("es-CO");
    document.getElementById("accDescripcion").textContent = product.detail;

    var isIntima = /sin cambio/i.test(product.detail);
    document.getElementById("pdpPolicyNote").textContent = isIntima
      ? "Prenda íntima: por higiene no tiene cambio, salvo defecto de fábrica."
      : "Cambios fáciles dentro de los primeros 5 días.";

    var mainImg = document.getElementById("pdpMain");
    var thumbsWrap = document.getElementById("pdpThumbs");
    var colorNameLbl = document.getElementById("pdpColorName");
    var colorsWrap = document.getElementById("pdpColors");

    function setColor(colorName){
      activeColor = colorName;
      var c = product.colors.find(function(cc){ return cc.name === colorName; });
      colorNameLbl.textContent = colorName;
      if (c && c.img) mainImg.src = c.img;
      colorsWrap.querySelectorAll(".swatch").forEach(function(sw){
        sw.classList.toggle("active", sw.getAttribute("data-color") === colorName);
      });
      thumbsWrap.querySelectorAll("button").forEach(function(t){
        t.classList.toggle("active", t.getAttribute("data-color") === colorName);
      });
    }

    colorsWrap.innerHTML = product.colors.map(function(c){
      return '<button type="button" class="swatch" style="background:' + c.hex + '" title="' + c.name + '" data-color="' + c.name + '" aria-label="' + c.name + '"></button>';
    }).join('');
    colorsWrap.querySelectorAll(".swatch").forEach(function(sw){
      sw.addEventListener("click", function(){ setColor(sw.getAttribute("data-color")); });
    });

    var withPhotos = product.colors.filter(function(c){ return c.img; });
    thumbsWrap.innerHTML = withPhotos.map(function(c){
      return '<button type="button" data-color="' + c.name + '"><img src="' + c.img + '" alt="' + c.name + '"></button>';
    }).join('');
    thumbsWrap.querySelectorAll("button").forEach(function(t){
      t.addEventListener("click", function(){ setColor(t.getAttribute("data-color")); });
    });

    setColor(activeColor);
    if (withPhotos.length === 0){
      mainImg.replaceWith(Object.assign(document.createElement("div"), {
        className: "product-photo placeholder",
        innerHTML: '<span>PAMPAY</span><small>Foto próximamente</small>',
        style: "position:static;width:100%;height:100%;"
      }));
    }

    /* talla: dato real es talla única — se muestra como única opción */
    document.getElementById("pdpSizes").innerHTML = '<button type="button" class="size-pill active">Talla única (M-L)</button>';

    /* cantidad */
    var qtyVal = document.getElementById("pdpQtyVal");
    document.getElementById("pdpQty").addEventListener("click", function(e){
      var btn = e.target.closest("button[data-act]");
      if (!btn) return;
      if (btn.getAttribute("data-act") === "inc") qty++;
      if (btn.getAttribute("data-act") === "dec") qty = Math.max(1, qty - 1);
      qtyVal.textContent = qty;
    });

    document.getElementById("pdpAddBtn").addEventListener("click", function(){
      PampayCart.addItem(product.id, activeColor, qty);
    });

    /* acordeón */
    document.querySelectorAll("#pdpAccordion .acc-item").forEach(function(item){
      item.querySelector(".acc-head").addEventListener("click", function(){
        var wasOpen = item.classList.contains("open");
        document.querySelectorAll("#pdpAccordion .acc-item").forEach(function(i){ i.classList.remove("open"); });
        if (!wasOpen) item.classList.add("open");
      });
    });
    document.querySelector("#pdpAccordion .acc-item").classList.add("open");

    /* modal guía de tallas */
    var modal = document.getElementById("sizeModal");
    document.getElementById("sizeGuideBtn").addEventListener("click", function(){ modal.classList.add("open"); });
    document.getElementById("sizeModalClose").addEventListener("click", function(){ modal.classList.remove("open"); });
    modal.addEventListener("click", function(e){ if (e.target === modal) modal.classList.remove("open"); });

    /* también te puede gustar */
    var related = pampayProductsByCategory(product.category).filter(function(p){ return p.id !== product.id; }).slice(0, 4);
    var relatedGrid = document.getElementById("relatedGrid");
    relatedGrid.innerHTML = related.map(pampayCardHTML).join('');
    pampayWireCards(relatedGrid);
  });
})();
