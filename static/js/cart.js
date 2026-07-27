const STORAGE_KEY = 'natural_foods_cart';
let produtoSelecionadoModal = null;

// Caminho exato da sua imagem local no Flask
const PLACEHOLDER_LOCAL = '/static/img/placeholder.jpg';

// Função para garantir que SEMPRE retorne um caminho válido
function tratarCaminhoImagem(caminho) {
    if (!caminho) return PLACEHOLDER_LOCAL;
    
    const imgStr = String(caminho).trim();
    
    // Trata retornos comuns do Flask/Jinja quando não há imagem
    if (['', 'None', 'null', 'undefined'].includes(imgStr)) {
        return PLACEHOLDER_LOCAL;
    }
    
    // Se já for URL completa ou base64
    if (imgStr.startsWith('http') || imgStr.startsWith('data:')) {
        return imgStr;
    }
    
    // Ajusta barras para evitar "/static//img/..."
    if (imgStr.startsWith('/static/')) {
        return imgStr;
    }
    if (imgStr.startsWith('static/')) {
        return '/' + imgStr;
    }
    
    return '/static/' + (imgStr.startsWith('/') ? imgStr.slice(1) : imgStr);
}

// 1. Obter carrinho
function obterCarrinho() {
    try {
        const dados = localStorage.getItem(STORAGE_KEY);
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        return [];
    }
}

// 2. Salvar carrinho e atualizar UI
function salvarCarrinho(carrinho) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    renderizarCarrinho();
}

// 3. Notificação Toast (Canto superior)
function exibirToast(mensagem) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (!toast) return;

    if (toastMsg && mensagem) {
        toastMsg.textContent = mensagem;
    }

    toast.classList.remove('translate-x-full', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
    }, 3000);
}

// 4. Adicionar produto ao carrinho (SEM ABRIR O DRAWER)
function adicionarAoCarrinho(produto) {
    let carrinho = obterCarrinho();
    const index = carrinho.findIndex(item => String(item.id) === String(produto.id));

    if (index > -1) {
        carrinho[index].quantidade += 1;
    } else {
        carrinho.push({
            id: String(produto.id),
            titulo: produto.titulo || 'Marmita Fitness',
            preco: parseFloat(produto.preco) || 0,
            imagem: produto.imagem || '',
            quantidade: 1
        });
    }

    salvarCarrinho(carrinho);
    exibirToast(`"${produto.titulo}" foi adicionado!`);
}

// 5. Alterar quantidade (+1 / -1)
function alterarQuantidade(id, delta) {
    let carrinho = obterCarrinho();
    const index = carrinho.findIndex(item => String(item.id) === String(id));

    if (index > -1) {
        carrinho[index].quantidade += delta;
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
        salvarCarrinho(carrinho);
    }
}

// 6. Remover item do carrinho
function removerDoCarrinho(id) {
    let carrinho = obterCarrinho();
    carrinho = carrinho.filter(item => String(item.id) !== String(id));
    salvarCarrinho(carrinho);
}

// 7. Atualizar Badges
function atualizarContadorCarrinho() {
    const carrinho = obterCarrinho();
    const totalItens = carrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0);
    
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
        badge.textContent = totalItens;
    });
}

// 8. Renderizar Lista no Modal do Carrinho
function renderizarCarrinho() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    if (!container || !subtotalEl) return;

    const carrinho = obterCarrinho();

    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
                <i class="fa-solid fa-basket-shopping text-5xl mb-3 opacity-40"></i>
                <p class="font-semibold text-gray-600">Seu carrinho está vazio</p>
                <p class="text-xs text-gray-400 mt-1">Adicione algumas marmitas para começar!</p>
            </div>
        `;
        subtotalEl.textContent = 'R$ 0,00';
        return;
    }

    let html = '';
    let subtotal = 0;

    carrinho.forEach(item => {
        const itemSubtotal = item.preco * item.quantidade;
        subtotal += itemSubtotal;

        const imgUrl = tratarCaminhoImagem(item.imagem);

        html += `
            <div class="py-4 flex gap-3 items-center">
                <img src="${imgUrl}" 
                     onerror="this.onerror=null; this.src='${PLACEHOLDER_LOCAL}';" 
                     alt="${item.titulo}" 
                     class="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0">
                
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-bold text-gray-800 truncate">${item.titulo}</h4>
                    <p class="text-xs font-semibold text-laranja mt-0.5">
                        R$ ${item.preco.toFixed(2).replace('.', ',')}
                    </p>
                    
                    <div class="flex items-center gap-2 mt-2">
                        <button type="button" onclick="alterarQuantidade('${item.id}', -1)" class="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs cursor-pointer transition">
                            -
                        </button>
                        <span class="text-xs font-bold text-gray-800 w-5 text-center">${item.quantidade}</span>
                        <button type="button" onclick="alterarQuantidade('${item.id}', 1)" class="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs cursor-pointer transition">
                            +
                        </button>
                    </div>
                </div>

                <div class="flex flex-col items-end justify-between self-stretch">
                    <button type="button" onclick="removerDoCarrinho('${item.id}')" class="text-gray-400 hover:text-red-500 text-sm p-1 cursor-pointer transition">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                    <span class="text-sm font-bold text-gray-900">
                        R$ ${itemSubtotal.toFixed(2).replace('.', ',')}
                    </span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

// --- MODAL DE DETALHES DO PRODUTO (VER MAIS) ---
function abrirModalProduto(btn) {
    const overlay = document.getElementById('product-modal-overlay');
    const modal = document.getElementById('product-modal');
    if (!overlay || !modal) return;

    // Guarda dados do produto para o botão de adicionar interno
    produtoSelecionadoModal = {
        id: btn.dataset.productId,
        titulo: btn.dataset.productTitle,
        preco: btn.dataset.productPrice,
        imagem: btn.dataset.productImage
    };

    // Preenche os campos do modal
    document.getElementById('modal-product-title').textContent = btn.dataset.productTitle || '';
    
    const desc = btn.closest('.group')?.querySelector('.line-clamp-3')?.textContent || 'Marmita saudável preparadas com ingredientes selecionados.';
    document.getElementById('modal-product-description').textContent = desc.trim();

    const cat = btn.closest('.group')?.querySelector('.uppercase')?.textContent || 'Marmita Fitness';
    document.getElementById('modal-product-category').textContent = cat.trim();

    const precoVal = parseFloat(btn.dataset.productPrice) || 0;
    document.getElementById('modal-product-price').textContent = `R$ ${precoVal.toFixed(2).replace('.', ',')}`;

    // Atualiza a imagem do modal garantindo o fallback
    const modalImgEl = document.getElementById('modal-product-image');
    modalImgEl.onerror = function() {
        this.onerror = null;
        this.src = PLACEHOLDER_LOCAL;
    };
    modalImgEl.src = tratarCaminhoImagem(btn.dataset.productImage);

    // Animação de exibição
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        modal.classList.remove('scale-95');
        modal.classList.add('scale-100');
    }, 10);
}

function fecharModalProduto() {
    const overlay = document.getElementById('product-modal-overlay');
    const modal = document.getElementById('product-modal');
    if (!overlay || !modal) return;

    overlay.classList.add('opacity-0');
    modal.classList.remove('scale-100');
    modal.classList.add('scale-95');

    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);
}

// --- DRAWER DO CARRINHO ---
function abrirCarrinho() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (!overlay || !drawer) return;

    renderizarCarrinho();
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        drawer.classList.remove('translate-x-full');
    }, 10);
}

function fecharCarrinho() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (!overlay || !drawer) return;

    overlay.classList.add('opacity-0');
    drawer.classList.add('translate-x-full');
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);
}

// --- LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();

    document.addEventListener('click', (e) => {
        // Ao clicar no botão da marmita no cardápio -> Abre o Modal Detalhado!
        const btnCard = e.target.closest('.add-to-cart-btn');
        if (btnCard) {
            e.preventDefault();
            abrirModalProduto(btnCard);
        }

        // Abrir carrinho pelo botão da navbar inferior
        if (e.target.closest('.open-cart-btn')) {
            e.preventDefault();
            abrirCarrinho();
        }
    });

    // Botão Adicionar dentro do Modal de Detalhes
    const modalAddBtn = document.getElementById('modal-add-to-cart-btn');
    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', () => {
            if (produtoSelecionadoModal) {
                adicionarAoCarrinho(produtoSelecionadoModal);
                fecharModalProduto();
            }
        });
    }

    // Fechar Modal Produto
    const closeProdBtn = document.getElementById('close-product-modal');
    if (closeProdBtn) closeProdBtn.addEventListener('click', fecharModalProduto);

    const prodOverlay = document.getElementById('product-modal-overlay');
    if (prodOverlay) {
        prodOverlay.addEventListener('click', (e) => {
            if (e.target === prodOverlay) fecharModalProduto();
        });
    }

    // Fechar Drawer Carrinho
    const closeCartBtn = document.getElementById('close-cart-btn');
    if (closeCartBtn) closeCartBtn.addEventListener('click', fecharCarrinho);

    const cartOverlay = document.getElementById('cart-drawer-overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) fecharCarrinho();
        });
    }
});