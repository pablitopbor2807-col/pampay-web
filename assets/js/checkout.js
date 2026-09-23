/* ============================================================
   PAMPAY — checkout.html
   Pago en línea (Wompi) queda pendiente de integrar con una función
   servidor (Netlify Functions) que firme la transacción — no es seguro
   calcular esa firma en el navegador. Mientras tanto, el pedido se
   confirma y coordina el pago por WhatsApp (contraentrega/Nequi/transferencia).
   ============================================================ */
(function(){
  var FREE_SHIPPING_FROM = 150000; // TODO: confirmar umbral real de envío gratis
  var FLAT_SHIPPING = 12000; // TODO: confirmar costo de envío real

  document.addEventListener("DOMContentLoaded", function(){
    var lines = PampayCart.getLines();
    var body = document.getElementById("checkoutBody");
    var linesWrap = document.getElementById("coLines");
    var totalsWrap = document.getElementById("coTotals");

    if (lines.length === 0){
      body.innerHTML = '<div class="co-empty"><p>Tu carrito está vacío.</p><a class="btn primary" href="index.html#catalogo" style="margin-top:1.2rem;">Ver catálogo</a></div>';
      return;
    }

    linesWrap.innerHTML = lines.map(function(l){
      var img = l.color.img || "";
      return '<div class="co-line">' +
        (img ? '<img src="' + img + '" alt="">' : '') +
        '<div><div class="cl-name">' + l.product.name + '</div>' +
        '<div class="cl-meta">' + l.color.name + ' · x' + l.qty + '</div>' +
        '<div class="cl-meta">' + PampayCart.money(l.lineTotal) + '</div></div></div>';
    }).join('');

    var subtotal = PampayCart.getSubtotal();
    var shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : FLAT_SHIPPING;
    var total = subtotal + shipping;

    totalsWrap.innerHTML =
      '<div class="row"><span>Subtotal</span><span>' + PampayCart.money(subtotal) + '</span></div>' +
      '<div class="row"><span>Envío</span><span>' + (shipping === 0 ? "Gratis" : PampayCart.money(shipping)) + '</span></div>' +
      '<div class="row grand"><span>Total</span><span>' + PampayCart.money(total) + '</span></div>';

    document.getElementById("shippingForm").addEventListener("submit", function(e){
      e.preventDefault();
      var name = document.getElementById("coName").value.trim();
      var phone = document.getElementById("coPhone").value.trim();
      var city = document.getElementById("coCity").value.trim();
      var dept = document.getElementById("coDept").value.trim();
      var address = document.getElementById("coAddress").value.trim();
      var notes = document.getElementById("coNotes").value.trim();

      var itemsText = lines.map(function(l){
        return "• " + l.product.name + " (" + l.color.name + ") x" + l.qty + " — " + PampayCart.money(l.lineTotal);
      }).join("\n");

      var msg = "Hola, quiero confirmar mi pedido en PAMPAY:\n\n" +
        itemsText + "\n\n" +
        "Envío: " + (shipping === 0 ? "Gratis" : PampayCart.money(shipping)) + "\n" +
        "Total: " + PampayCart.money(total) + "\n\n" +
        "Datos de envío:\n" +
        "Nombre: " + name + "\n" +
        "Celular: " + phone + "\n" +
        "Dirección: " + address + ", " + city + ", " + dept +
        (notes ? "\nNotas: " + notes : "") +
        "\n\n¿Cómo puedo pagar?";

      window.open(PAMPAY_WA_LINK(msg), "_blank");
    });
  });
})();
