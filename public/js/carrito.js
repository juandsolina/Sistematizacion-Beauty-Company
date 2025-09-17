/* carrito.js: renderiza productos y maneja carrito (localStorage) */

// Productos de ejemplo (reemplázalos por tu catálogo real si quieres)
const productos = [
  { id: 'p1', nombre: 'Toallitas', precio: 6000, img: 'img/Toallitas.png' },
  { id: 'p2', nombre: 'Ollita de cera', precio: 35000, img: 'img/ollita de cera.png' },
  { id: 'p3', nombre: 'Pulidor', precio: 100000, img: 'img/pulidor.png' },
  { id: 'p4', nombre: 'Papel cuellero', precio: 11000, img: 'img/cuellero.png' }
];

let cart = JSON.parse(localStorage.getItem('cart_demo')) || {};

const $ = sel => document.querySelector(sel);
const toCurrency = v => '$' + Number(v).toFixed(2);

// Render del grid de productos usando las clases que espera catalogo.css
function renderProductos(){
  const cont = $('#productos');
  cont.innerHTML = '';
  productos.forEach(p => {
    const card = document.createElement('article');
    card.className = 'producto';
    card.innerHTML = `
      <img class="producto-imagen" src="${p.img}" alt="${p.nombre}">
      <h2>${p.nombre}</h2>
      <p>${toCurrency(p.precio)}</p>
      <div class="btn-container">
        <button data-id="${p.id}" class="add-btn">
          <i class='bx bx-cart'></i> Añadir
        </button>
      </div>
    `;
    cont.appendChild(card);
  });
}

// Render del carrito (sidebar)
function renderCart(){
  const itemsEl = $('#cartItems');
  itemsEl.innerHTML = '';
  const ids = Object.keys(cart);
  let total = 0;
  if(ids.length === 0){
    itemsEl.innerHTML = '<p style="opacity:0.7">El carrito está vacío.</p>';
  } else {
    ids.forEach(id => {
      const entry = cart[id];
      const prod = productos.find(p=>p.id===id) || { nombre: entry.nombre || 'Producto', precio: entry.precio || 0, img: entry.img || '' };
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${prod.img}" alt="${prod.nombre}">
        <div class="meta">
          <b>${prod.nombre}</b>
          <small>${toCurrency(prod.precio)} × ${entry.qty} = <span style="font-weight:700">${toCurrency(prod.precio * entry.qty)}</span></small>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          <div class="qty-controls">
            <button data-action="dec" data-id="${id}">-</button>
            <div style="min-width:24px;text-align:center">${entry.qty}</div>
            <button data-action="inc" data-id="${id}">+</button>
          </div>
          <button data-action="remove" data-id="${id}" style="background:transparent;border:none;color:#f00898;cursor:pointer">Eliminar</button>
        </div>
      `;
      itemsEl.appendChild(div);
      total += prod.precio * entry.qty;
    });
  }
  $('#cartTotal').textContent = toCurrency(total);
  $('#cartCount').textContent = ids.reduce((s,k)=> s + cart[k].qty, 0) || 0;
  localStorage.setItem('cart_demo', JSON.stringify(cart));
}

// Añadir producto al carrito
function addToCart(id){
  if(!cart[id]) cart[id] = { qty: 0 };
  cart[id].qty++;
  renderCart();
  openCart();
}

// Eventos
document.addEventListener('click', (e)=>{
  const add = e.target.closest('.add-btn');
  if(add){ addToCart(add.dataset.id); return; }

  const actionBtn = e.target.closest('[data-action]');
  if(actionBtn){
    const action = actionBtn.dataset.action;
    const id = actionBtn.dataset.id;
    if(action === 'inc') cart[id].qty++;
    else if(action === 'dec'){ cart[id].qty = Math.max(0, cart[id].qty - 1); if(cart[id].qty === 0) delete cart[id]; }
    else if(action === 'remove') delete cart[id];
    renderCart();
    return;
  }

  if(e.target.id === 'openCart' || e.target.closest('#openCart')) toggleCart();
  if(e.target.id === 'closeCart' || e.target.closest('#closeCart')) closeCart();
  if(e.target.id === 'clearCart') { cart = {}; renderCart(); }
  if(e.target.id === 'checkoutBtn') {
    if(Object.keys(cart).length === 0) { alert('Tu carrito está vacío'); return; }
    alert('Simulación: enviar carrito al backend /checkout');
    // Aquí podrías hacer: fetch('/api/checkout', { method:'POST', body: JSON.stringify(cart) })
  }
});

// Sidebar open/close
const sidebar = () => document.getElementById('cartSidebar');
function openCart(){ sidebar().classList.add('open'); sidebar().setAttribute('aria-hidden','false'); }
function closeCart(){ sidebar().classList.remove('open'); sidebar().setAttribute('aria-hidden','true'); }
function toggleCart(){ sidebar().classList.toggle('open'); const open = sidebar().classList.contains('open'); sidebar().setAttribute('aria-hidden', !open); }

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderProductos();
  renderCart();
});
