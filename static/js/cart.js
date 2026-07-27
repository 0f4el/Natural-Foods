const STORAGE_KEY = 'natural_foods_cart';

// 1. Obter carrinho
function obterCarrinho() {
    try {
        const dados = localStorage.getItem(STORAGE_KEY);
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        return [];
    }
}

// 2. Salvar e atualizar
function salvarCarrinho(carrinho) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

// 3. Adicionar produto (Task 05.1)
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
}

// 4. Atualizar Badge (Task 05.2)
function atualizarContadorCarrinho() {
    const carrinho = obterCarrinho();
    const totalItens = carrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0);
    
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
        badge.textContent = totalItens;
    });
}

// --- ESCUTA DE EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) {
            e.preventDefault();

            const produto = {
                id: btn.dataset.productId,
                titulo: btn.dataset.productTitle,
                preco: btn.dataset.productPrice,
                imagem: btn.dataset.productImage
            };

            if (produto.id) {
                adicionarAoCarrinho(produto);
            }
        }
    });
});