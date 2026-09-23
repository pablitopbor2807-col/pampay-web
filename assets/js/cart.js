/* ============================================================
   PAMPAY — carrito (localStorage) + drawer + toast
   Se incluye en TODAS las páginas antes que el script propio de cada página.
   ============================================================ */
var PampayCart = (function(){
  var STORAGE_KEY = "pampay_cart_v1";

  function money(n){ return "$" + n.toLocaleString("es-CO"); }

  function read(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  function write(items){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }catch(e){}
    renderBadge();
    renderDrawer();
  }

  function lineKey(productId, colorName){ return productId + "|" + colorName; }

  function addItem(productId, colorName, qty){
    qty = qty || 1;
    var items = read();
    var key = lineKey(productId, colorName);
    var existing = items.find(function(it){ return it.key === key; });
    if (existing){ existing.qty += qty; }
    else { items.push({ key: key, productId: productId, colorName: colorName, qty: qty }); }
    write(items);
    showToast("Agregado al carrito");
    openDrawer();
  }

  function updateQty(key, delta){
    var items = read();
    var line = items.find(function(it){ return it.key === key; });
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0){ items = items.filter(function(it){ return it.key !== key; }); }
    write(items);
  }

  function removeItem(key){
    var items = read().filter(function(it){ return it.key !== key; });
    write(items);
  }

  function clear(){ write([]); }

  function enrich(items){
    return items.map(function(it){
      var p = typeof pampayFindProduct === "function" ? pampayFindProduct(it.productId) : null;
      if (!p) return null;
      var color = p.colors.find(function(c){ return c.name === it.colorName; }) || p.colors[0];
      return {
        key: it.key, qty: it.qty, product: p, color: color,
        lineTotal: p.price * it.qty
      };
    }).filter(Boolean);
  }

  function getSubtotal(){
    return enrich(read()).reduce(function(sum, l){ return sum + l.lineTotal; }, 0);
  }

  function getCount(){
    return read().reduce(function(sum, it){ return sum + it.qty; }, 0);
  }

  /* ---------- UI: badge, toast, drawer ---------- */
  function renderBadge(){
    var badge = document.getElementById("cartCount");
    if (!badge) return;
    var count = getCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }

  var toastTimer = null;
  function showToast(msg){
    var toast = document.getElementById("pampayToast");
    if (!toast){
      toast = document.createElement("div");
      toast.id = "pampayToast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.classList.remove("show"); }, 2200);
  }

  function ensureDrawer(){
    if (document.getElementById("cartDrawer")) return;
    var overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.id = "cartOverlay";
    overlay.addEventListener("click", closeDrawer);

    var drawer = document.createElement("div");
    drawer.className = "cart-drawer";
    drawer.id = "cartDrawer";
    drawer.innerHTML =
      '<div class="cart-head"><h3>Tu carrito</h3><button class="cart-close" id="cartCloseBtn" aria-label="Cerrar">&times;</button></div>' +
      '<div class="cart-items" id="cartItemsWrap"></div>' +
      '<div class="cart-foot" id="cartFoot"></div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    document.getElementById("cartCloseBtn").addEventListener("click", closeDrawer);
  }

  function openDrawer(){
    ensureDrawer();
    renderDrawer();
    document.getElementById("cartOverlay").classList.add("open");
    document.getElementById("cartDrawer").classList.add("open");
  }
  function closeDrawer(){
    var o = document.getElementById("cartOverlay");
    var d = document.getElementById("cartDrawer");
    if (o) o.classList.remove("open");
    if (d) d.classList.remove("open");
  }

  function renderDrawer(){
    var wrap = document.getElementById("cartItemsWrap");
    var foot = document.getElementById("cartFoot");
    if (!wrap || !foot) return;

    var lines = enrich(read());
    if (lines.length === 0){
      wrap.innerHTML = '<p class="cart-empty">Tu carrito está vacío.<br>Explora el <a href="index.html#catalogo" style="text-decoration:underline;">catálogo</a>.</p>';
      foot.innerHTML = '';
      return;
    }

    wrap.innerHTML = lines.map(function(l){
      var img = l.color.img || "assets/img/productos/placeholder.jpg";
      return (
        '<div class="cart-line" data-key="' + l.key + '">' +
          '<img src="' + img + '" alt="' + l.product.name + '" onerror="this.style.visibility=\'hidden\'">' +
          '<div style="flex:1;">' +
            '<div class="cl-name">' + l.product.name + '</div>' +
            '<div class="cl-meta">Color: ' + l.color.name + '</div>' +
            '<div class="cl-price">' + money(l.lineTotal) + '</div>' +
            '<div class="qty-stepper">' +
              '<button data-act="dec" data-key="' + l.key + '">&minus;</button>' +
              '<span>' + l.qty + '</span>' +
              '<button data-act="inc" data-key="' + l.key + '">+</button>' +
            '</div><br>' +
            '<button class="cl-remove" data-act="remove" data-key="' + l.key + '">Eliminar</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    var subtotal = lines.reduce(function(s,l){ return s + l.lineTotal; }, 0);
    foot.innerHTML =
      '<div class="cart-subtotal"><span>Subtotal</span><span>' + money(subtotal) + '</span></div>' +
      '<a href="checkout.html" class="btn primary block">Ir a pagar</a>';

    wrap.querySelectorAll("button[data-act]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var key = btn.getAttribute("data-key");
        var act = btn.getAttribute("data-act");
        if (act === "inc") updateQty(key, 1);
        if (act === "dec") updateQty(key, -1);
        if (act === "remove") removeItem(key);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    ensureDrawer();
    renderBadge();
    renderDrawer();
    var cartBtn = document.getElementById("cartOpenBtn");
    if (cartBtn) cartBtn.addEventListener("click", openDrawer);
  });

  return {
    addItem: addItem, updateQty: updateQty, removeItem: removeItem, clear: clear,
    getSubtotal: getSubtotal, getCount: getCount, getLines: function(){ return enrich(read()); },
    openDrawer: openDrawer, closeDrawer: closeDrawer, money: money, showToast: showToast
  };
})();
