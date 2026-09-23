/* ============================================================
   PAMPAY — helper compartido para pintar tarjetas de producto
   (usado en home, categoría y "también te puede gustar")
   ============================================================ */
function pampayCardHTML(product){
  var firstWithImg = product.colors.find(function(c){ return c.img; });
  var img = firstWithImg ? firstWithImg.img : null;
  var media = img
    ? '<img class="img-1" src="' + img + '" alt="' + product.name + '">' +
      '<img class="img-2" src="' + img + '" alt="">'
    : '<div class="product-photo placeholder"><span>PAMPAY</span><small>Foto próximamente</small></div>';

  var tag = product.tag ? '<span class="product-tag">' + product.tag + '</span>' : '';

  var swatches = product.colors.map(function(c, i){
    return '<button type="button" class="swatch' + (i===0?' active':'') + '" style="background:' + c.hex + '" title="' + c.name + '" data-color="' + c.name + '" aria-label="' + c.name + '"></button>';
  }).join('');

  return (
    '<div class="product-card" data-id="' + product.id + '">' +
      '<a class="product-media" href="producto.html?id=' + product.id + '">' + tag + media + '</a>' +
      '<div class="product-body">' +
        '<a href="producto.html?id=' + product.id + '"><h3>' + product.name + '</h3></a>' +
        '<div class="product-price">$' + product.price.toLocaleString("es-CO") + '</div>' +
        '<div class="swatch-row">' + swatches + '</div>' +
        '<button type="button" class="btn primary sm product-cta" data-add="' + product.id + '">Agregar al carrito</button>' +
      '</div>' +
    '</div>'
  );
}

function pampayWireCards(container){
  container.querySelectorAll(".product-card").forEach(function(card){
    var id = card.getAttribute("data-id");
    var product = pampayFindProduct(id);
    if (!product) return;
    var media = card.querySelector(".product-media");
    var img1 = card.querySelector(".img-1");

    var activeColor = product.colors[0].name;
    card.querySelectorAll(".swatch").forEach(function(sw){
      sw.addEventListener("click", function(e){
        e.preventDefault();
        var colorName = sw.getAttribute("data-color");
        activeColor = colorName;
        card.querySelectorAll(".swatch").forEach(function(s){ s.classList.remove("active"); });
        sw.classList.add("active");
        var c = product.colors.find(function(cc){ return cc.name === colorName; });
        if (c && c.img && img1) img1.src = c.img;
      });
    });

    var addBtn = card.querySelector("[data-add]");
    if (addBtn){
      addBtn.addEventListener("click", function(e){
        e.preventDefault();
        PampayCart.addItem(product.id, activeColor, 1);
      });
    }
  });
}
