interface Producto {
  id: string;
  nombre: string;
  precio: number;
  img: string;
}

interface CartEntry {
  qty: number;
  nombre?: string;
  precio?: number;
  img?: string;
}

function getCartFromStorage(): Record<string, CartEntry> {
  const data = localStorage.getItem('cart_demo');
  if (!data) return {};
  try {
    const parsed = JSON.parse(data);
    if (typeof parsed === 'object' && parsed !== null) {
      const result: Record<string, CartEntry> = {};
      for (const key in parsed) {
        const val = parsed[key];
        if (val && typeof val.qty === 'number') {
          result[key] = val;
        }
      }
      return result;
    }
    return {};
  } catch {
    return {};
  }
}

let cart: Record<string, CartEntry> = getCartFromStorage();

const $ = (sel: string): HTMLElement | null => document.querySelector(sel);
const toCurrency = (v: number): string => '$' + v.toFixed(2);

const productos: Producto[] = [
  { id: 'p1', nombre: 'Toallitas', precio: 6000, img: 'img/Toallitas.png' },
  { id: 'p2', nombre: 'Ollita de cera', precio: 35000, img: 'img/ollita de cera.png' },
  { id: 'p3', nombre: 'Pulidor', precio: 100000, img: 'img/pulidor.png' },
  { id: 'p4', nombre: 'Papel cuellero', precio: 11000, img: 'img/cuellero.png' }
];

function renderProductos(): void {
  const cont = $('#productos');
  if (!cont) return;
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

function renderCart(): void {
  const itemsEl = $('#cartItems');
  if (!itemsEl) return;
  itemsEl.innerHTML = '';
  const ids = Object.keys(cart);
  let total = 0;
  if (ids.length === 0) {
    itemsEl.innerHTML = '<p style="opacity:0.7">El carrito está vacío.</p>';
  } else {
    ids.forEach(id => {
      const entry = cart[id];
      if (!entry) return;
      const prod = productos.find(p => p.id === id) || {
        nombre: entry.nombre ?? 'Producto',
        precio: entry.precio ?? 0,
        img: entry.img ?? ''
      };
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${prod.img}" alt="${prod.nombre}">
        <div class="meta">
          <b>${prod.nombre}</b>
          <small>${toCurrency(prod.precio * entry.qty)} = <span style="font-weight:700">${toCurrency(prod.precio * entry.qty)}</span></small>
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
  const cartTotal = $('#cartTotal');
  if (cartTotal) cartTotal.textContent = toCurrency(total);
  const cartCount = $('#cartCount');
  if (cartCount) {
    cartCount.textContent = ids.reduce((s, k) => {
      const entry = cart[k];
      return s + (entry ? entry.qty : 0);
    }, 0).toString() || '0';
  }
  localStorage.setItem('cart_demo', JSON.stringify(cart));
}

function addToCart(id: string): void {
  if (!cart[id]) cart[id] = { qty: 0 };
  cart[id].qty++;
  renderCart();
  openCart();
}

document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const add = target.closest('.add-btn') as HTMLElement | null;
  if (add) { addToCart(add.dataset.id!); return; }

  const actionBtn = target.closest('[data-action]') as HTMLElement | null;
  if (actionBtn) {
    const action = actionBtn.dataset.action;
    const id = actionBtn.dataset.id!;
    if (action === 'inc') {
      if (cart[id]) cart[id].qty++;
    }
    else if (action === 'dec') {
      if (cart[id]) {
        cart[id].qty = Math.max(0, cart[id].qty - 1);
        if (cart[id].qty === 0) delete cart[id];
      }
    }
    else if (action === 'remove') delete cart[id];
    renderCart();
    return;
  }

  if (target.id === 'openCart' || target.closest('#openCart')) toggleCart();
  if (target.id === 'closeCart' || target.closest('#closeCart')) closeCart();
  if (target.id === 'clearCart') { cart = {}; renderCart(); }
  if (target.id === 'checkoutBtn') {
    if (Object.keys(cart).length === 0) { alert('Tu carrito está vacío'); return; }
    alert('Simulación: enviar carrito al backend /checkout');
  }
});

const sidebar = (): HTMLElement => document.getElementById('cartSidebar') as HTMLElement;
function openCart(): void {
  const s = sidebar();
  s.classList.add('open');
  s.setAttribute('aria-hidden', 'false');
}
function closeCart(): void {
  const s = sidebar();
  s.classList.remove('open');
  s.setAttribute('aria-hidden', 'true');
}
function toggleCart(): void {
  const s = sidebar();
  s.classList.toggle('open');
  const open = s.classList.contains('open');
  s.setAttribute('aria-hidden', (!open).toString());
}

document.addEventListener('DOMContentLoaded', () => {
  renderProductos();
  renderCart();
});
