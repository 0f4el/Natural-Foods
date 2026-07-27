/**
 * Gerenciador de Carrinho de Compras - Natural Foods
 * Suporta persistência via LocalStorage e atualização de UI em tempo real.
 */

const STORAGE_KEY = 'natural_foods_cart';

// Estado global do carrinho
let cart = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initCartUI();
    bindEvents();
});

// --- LÓGICA DE DADOS / LOCALSTORAGE ---

function loadCart() {
    try {
        const storedCart = localStorage.getItem(STORAGE_KEY);
        cart = storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
        console.error("Erro ao carregar o carrinho do LocalStorage:", e);
        cart = [];
    }
    updateCartUI();
}

function saveCart() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.error("Erro ao salvar no LocalStorage:", e);
    }
    updateCartUI();
}

/**
 * Adiciona um produto ou incrementa sua quantidade
 */
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: parseFloat(product.price),
            image: product.image || '',
            quantity: 1
        });
    }

    saveCart();
    openCartDrawer();
}

/**
 * Altera a quantidade de um item (remove se atingir 0)
 */
function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        saveCart();
    }
}

/**
 * Remove um item completamente do carrinho
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

// --- LÓGICA DE INTERFACE (UI) ---

function updateCartUI() {
    updateBadgeCount();
    renderCartItems();
    updateTotals();
}

function updateBadgeCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badgeElements = document.querySelectorAll('.cart-count-badge');

    badgeElements.forEach(badge => {
        badge.textContent = totalCount;
        // Mantém a bolinha visível na barra inferior
        badge.classList.remove('hidden');
    });
}

function updateTotals() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedTotal = `R$ ${total.toFixed(2).replace('.', ',')}`;

    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = formattedTotal;
    if (totalEl) totalEl.textContent = formattedTotal;
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="lucide-shopping-bag text-4xl mb-2 text-gray-300"></i>
                <p>Seu carrinho está vazio.</p>
                <p class="text-xs mt-1">Adicione algumas de nossas marmitas saudáveis!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100" data-id="${item.id}">
            ${item.image ? `<img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded-md">` : ''}
            
            <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-sm text-gray-800 truncate">${item.title}</h4>
                <p class="text-xs text-primary font-bold mt-1">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
            </div>

            <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-1">
                <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 font-bold">-</button>
                <span class="text-xs font-semibold w-4 text-center">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 font-bold">+</button>
            </div>

            <button onclick="removeFromCart('${item.id}')" class="text-red-400 hover:text-red-600 p-1" title="Remover item">
                <i class="lucide-trash-2 text-base"></i>
            </button>
        </div>
    `).join('');
}

// --- AÇÕES DO DRAWER (ABRIR / FECHAR) ---

function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    
    if (drawer && overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('opacity-100'), 10);
        drawer.classList.remove('translate-x-full');
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');

    if (drawer && overlay) {
        drawer.classList.add('translate-x-full');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

// --- EVENT BINDINGS ---

function bindEvents() {
    // Abrir carrinho ao clicar no botão/ícone do header ou nav
    document.querySelectorAll('.open-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    });

    // Fechar ao clicar no 'X' ou overlay
    document.getElementById('close-cart-btn')?.addEventListener('click', closeCartDrawer);
    document.getElementById('cart-drawer-overlay')?.addEventListener('click', closeCartDrawer);

    // Capturar cliques nos botões "Adicionar ao Carrinho" das marmitas
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            const card = addBtn.closest('[data-product-id]');
            
            if (card) {
                const product = {
                    id: card.dataset.productId,
                    title: card.dataset.productTitle || card.querySelector('h3')?.innerText || 'Marmita Fitness',
                    price: card.dataset.productPrice || 20.00,
                    image: card.dataset.productImage || card.querySelector('img')?.src || ''
                };
                addToCart(product);
            }
        }
    });
}