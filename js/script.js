// Função para adicionar novos campos de link
function addLink(button) {
    const linksSection = button.previousElementSibling;
    const newLinkGroup = document.createElement('div');
    newLinkGroup.className = 'link-group';
    newLinkGroup.innerHTML = `
        <input type="url" class="link-input" placeholder="Cole aqui o link do produto...">
        <button class="btn remove-btn" onclick="removeLink(this)">×</button>
    `;
    linksSection.appendChild(newLinkGroup);
    
    // Adicionar event listener para o novo input
    const newInput = newLinkGroup.querySelector('.link-input');
    newInput.addEventListener('input', function() {
        saveData();
    });
}

// Função para remover campos de link
function removeLink(button) {
    const linkGroup = button.parentElement;
    const linksSection = linkGroup.parentElement;
    
    // Só remove se houver mais de um campo de link
    if (linksSection.children.length > 1) {
        linkGroup.remove();
        saveData();
    }
}

// Função para abrir o modal de adicionar item
function addNewCard() {
    const modal = document.getElementById('addItemModal');
    const input = document.getElementById('itemNameInput');
    
    // Verificar se o modal já está aberto
    if (modal.style.display === 'block') {
        return;
    }
    
    // Limpar o input e focar nele
    input.value = '';
    input.disabled = false;
    modal.style.display = 'block';
    input.focus();
    
    // Remover event listeners anteriores para evitar duplicação
    input.removeEventListener('keypress', handleEnterKey);
    document.removeEventListener('keydown', handleEscapeKey);
    
    // Adicionar event listener para Enter
    input.addEventListener('keypress', handleEnterKey);
    
    // Adicionar event listener para Escape
    document.addEventListener('keydown', handleEscapeKey);
}

// Função para lidar com a tecla Enter
function handleEnterKey(e) {
    if (e.key === 'Enter') {
        confirmAddItem();
    }
}

// Função para lidar com a tecla Escape
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('addItemModal');
    modal.style.display = 'none';
}

// Função para confirmar a adição do item
function confirmAddItem() {
    const input = document.getElementById('itemNameInput');
    const itemName = input.value.trim();
    
    if (itemName !== '') {
        // Prevenir múltiplas execuções
        if (input.disabled) return;
        
        input.disabled = true;
        createNewCard(itemName);
        closeModal();
        
        // Reabilitar o input após um breve delay
        setTimeout(() => {
            input.disabled = false;
        }, 100);
    } else {
        // Destacar o input se estiver vazio
        input.style.borderColor = '#dc3545';
        input.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        
        setTimeout(() => {
            input.style.borderColor = '#e9ecef';
            input.style.boxShadow = 'none';
        }, 2000);
    }
}

// Função para criar o novo card
function createNewCard(itemName) {
    const cardData = {
        title: itemName,
        links: [],
        image: null
    };
    
    createCardFromData(cardData);
    
    // Adicionar efeito de fade in ao último card criado
    const itemsGrid = document.querySelector('.items-grid');
    const newCard = itemsGrid.lastElementChild;
    
    newCard.style.opacity = '0';
    newCard.style.transform = 'scale(0.8)';
    
    // Animar a entrada do card
    setTimeout(() => {
        newCard.style.transition = 'all 0.3s ease';
        newCard.style.opacity = '1';
        newCard.style.transform = 'scale(1)';
    }, 10);
    
    // Salvar dados após adicionar o card
    saveData();
}

// Função para acionar o upload de imagem
function triggerImageUpload(button) {
    const imageInput = button.parentElement.parentElement.querySelector('.image-input');
    imageInput.click();
}

// Função para lidar com upload de imagem
function handleImageUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageContainer = input.parentElement;
            const image = imageContainer.querySelector('.product-image');
            const placeholder = imageContainer.querySelector('.image-placeholder');
            const uploadBtn = imageContainer.querySelector('.image-upload-btn');
            const urlBtn = imageContainer.querySelector('.image-url-btn');
            
            if (image) image.src = e.target.result;
            if (image) image.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
            if (uploadBtn) uploadBtn.style.display = 'none';
            if (urlBtn) urlBtn.style.display = 'none';
            
            // Remover botão de remover imagem existente se houver
            const existingRemoveBtn = imageContainer.querySelector('.remove-image-btn');
            if (existingRemoveBtn) {
                existingRemoveBtn.remove();
            }
            
            // Adicionar botão de remover imagem
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-danger remove-image-btn';
            removeBtn.textContent = '❌ Remover Imagem';
            removeBtn.onclick = function() {
                removeImage(this);
            };
            imageContainer.appendChild(removeBtn);
            
            // Salvar dados
            setTimeout(() => {
                saveData();
            }, 100);
        };
        reader.readAsDataURL(file);
    }
}

// Função para mostrar input de URL de imagem
function showImageUrlInput(button) {
    const imageContainer = button.parentElement.parentElement;
    const placeholder = imageContainer.querySelector('.image-placeholder');
    
    // Criar input para URL
    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.className = 'image-url-input';
    urlInput.placeholder = 'Cole aqui a URL da imagem...';
    
    // Criar botão de confirmar
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary';
    confirmBtn.textContent = 'Confirmar';
    confirmBtn.onclick = function() {
        const url = urlInput.value.trim();
        if (url === '') {
            alert('❌ Campo vazio!\n\nPor favor, digite uma URL válida.');
            return;
        }
        loadImageFromUrl(url, imageContainer);
    };
    
    // Substituir placeholder pelo input
    placeholder.innerHTML = '';
    placeholder.appendChild(urlInput);
    placeholder.appendChild(confirmBtn);
    placeholder.style.display = 'flex';
    placeholder.style.flexDirection = 'column';
    placeholder.style.gap = '10px';
    
    // Focar no input
    urlInput.focus();
}

// Função para carregar imagem de URL
function loadImageFromUrl(url, imageContainer) {
    if (url && url.trim() !== '') {
        // Validação básica de URL
        try {
            new URL(url);
        } catch (e) {
            alert('❌ URL inválida!\n\nA URL fornecida não é válida.\nExemplo de URL válida: https://exemplo.com/imagem.jpg');
            
            // Restaurar placeholder com os botões
            const placeholder = imageContainer.querySelector('.image-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <button class="btn btn-secondary image-upload-btn" onclick="triggerImageUpload(this)">
                        📷 Adicionar Imagem
                    </button>
                    <button class="btn btn-secondary image-url-btn" onclick="showImageUrlInput(this)">
                        🔗 URL da Imagem
                    </button>
                `;
                placeholder.style.display = 'flex';
                placeholder.style.flexDirection = 'column';
                placeholder.style.alignItems = 'center';
                placeholder.style.justifyContent = 'center';
                placeholder.style.gap = '10px';
            }
            return;
        }
        const image = imageContainer.querySelector('.product-image');
        const placeholder = imageContainer.querySelector('.image-placeholder');
        const uploadBtn = imageContainer.querySelector('.image-upload-btn');
        const urlBtn = imageContainer.querySelector('.image-url-btn');
        
        // Testar se a imagem carrega
        const testImg = new Image();
        testImg.onload = function() {
            if (image) image.src = url;
            if (image) image.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
            if (uploadBtn) uploadBtn.style.display = 'none';
            if (urlBtn) urlBtn.style.display = 'none';
            
            // Remover botão de remover imagem existente se houver
            const existingRemoveBtn = imageContainer.querySelector('.remove-image-btn');
            if (existingRemoveBtn) {
                existingRemoveBtn.remove();
            }
            
            // Adicionar botão de remover imagem
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-danger remove-image-btn';
            removeBtn.textContent = '❌ Remover Imagem';
            removeBtn.onclick = function() {
                removeImage(this);
            };
            imageContainer.appendChild(removeBtn);
            
            // Salvar dados
            setTimeout(() => {
                saveData();
            }, 100);
        };
        testImg.onerror = function() {
            alert('❌ Erro ao carregar a imagem!\n\nPossíveis motivos:\n• URL inválida ou inexistente\n• Imagem não é pública\n• Formato não suportado\n• Problema de conexão\n\nVerifique se a URL está correta e tente novamente.');
            
            // Restaurar placeholder com os botões
            if (placeholder) {
                placeholder.innerHTML = `
                    <button class="btn btn-secondary image-upload-btn" onclick="triggerImageUpload(this)">
                        📷 Adicionar Imagem
                    </button>
                    <button class="btn btn-secondary image-url-btn" onclick="showImageUrlInput(this)">
                        🔗 URL da Imagem
                    </button>
                `;
                placeholder.style.display = 'flex';
                placeholder.style.flexDirection = 'column';
                placeholder.style.alignItems = 'center';
                placeholder.style.justifyContent = 'center';
                placeholder.style.gap = '10px';
            }
        };
        testImg.src = url;
    }
}

// Função para remover imagem
function removeImage(button) {
    const imageContainer = button.parentElement.parentElement;
    const image = imageContainer.querySelector('.product-image');
    const placeholder = imageContainer.querySelector('.image-placeholder');
    const uploadBtn = imageContainer.querySelector('.image-upload-btn');
    const urlBtn = imageContainer.querySelector('.image-url-btn');
    
    if (image) image.src = '';
    if (image) image.style.display = 'none';
    
    // Restaurar os botões no placeholder
    placeholder.innerHTML = `
        <button class="btn btn-secondary image-upload-btn" onclick="triggerImageUpload(this)">
            📷 Adicionar Imagem
        </button>
        <button class="btn btn-secondary image-url-btn" onclick="showImageUrlInput(this)">
            🔗 URL da Imagem
        </button>
    `;
    placeholder.style.display = 'flex';
    placeholder.style.flexDirection = 'column';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.gap = '10px';
    
    // Remover botão de remover imagem se existir
    const removeBtn = imageContainer.querySelector('.remove-image-btn');
    if (removeBtn) {
        removeBtn.remove();
    }
    
    // Salvar dados
    setTimeout(() => {
        saveData();
    }, 100);
}

// Função para excluir cards
function deleteCard(button) {
    const card = button.parentElement;
    
    // Adiciona efeito de fade out antes de remover
    card.style.transition = 'all 0.3s ease';
    card.style.transform = 'scale(0.8)';
    card.style.opacity = '0';
    
    setTimeout(() => {
        card.remove();
        // Salva os dados após remover o card
        saveData();
    }, 300);
}

// Função para salvar dados no localStorage
function saveData() {
    const cards = document.querySelectorAll('.item-card');
    const data = {
        cards: []
    };
    
    cards.forEach((card, cardIndex) => {
        const cardData = {
            title: card.querySelector('.item-title').textContent,
            links: [],
            image: null
        };
        
        // Salvar links
        const linkInputs = card.querySelectorAll('.link-input');
        linkInputs.forEach(input => {
            if (input.value.trim()) {
                cardData.links.push(input.value.trim());
            }
        });
        
        // Salvar imagem se existir
        const image = card.querySelector('.product-image');
        if (image && image.src && image.src !== '' && image.style.display !== 'none') {
            cardData.image = image.src;
        }
        
        data.cards.push(cardData);
    });
    
    localStorage.setItem('shoppingList', JSON.stringify(data));
}

// Função para carregar dados do localStorage
function loadData() {
    const savedData = localStorage.getItem('shoppingList');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        if (data.cards && data.cards.length > 0) {
            // Limpar cards existentes
            const itemsGrid = document.querySelector('.items-grid');
            itemsGrid.innerHTML = '';
            
            // Recriar cards salvos
            data.cards.forEach(cardData => {
                createCardFromData(cardData);
            });
        }
    }
}

// Função para criar card a partir dos dados salvos
function createCardFromData(cardData) {
    const itemsGrid = document.querySelector('.items-grid');
    
    const newCard = document.createElement('div');
    newCard.className = 'item-card';
    
    // Criar estrutura do card
    let cardHTML = `
        <button class="delete-card-btn" onclick="deleteCard(this)" title="Excluir item">×</button>
        <h2 class="item-title">${cardData.title}</h2>
        <div class="item-image">
            <img src="${cardData.image || ''}" alt="Imagem do produto" class="product-image" style="display: ${cardData.image ? 'block' : 'none'};">
            <div class="image-placeholder" style="display: ${cardData.image ? 'none' : 'flex'}; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                <button class="btn btn-secondary image-upload-btn" onclick="triggerImageUpload(this)">
                    📷 Adicionar Imagem
                </button>
                <button class="btn btn-secondary image-url-btn" onclick="showImageUrlInput(this)">
                    🔗 URL da Imagem
                </button>
            </div>
            <input type="file" class="image-input" accept="image/*" onchange="handleImageUpload(this)" style="display: none;">
        </div>
        <div class="links-section">
    `;
    
    // Adicionar links salvos
    if (cardData.links && cardData.links.length > 0) {
        cardData.links.forEach(link => {
            cardHTML += `
                <div class="link-group">
                    <input type="url" class="link-input" placeholder="Cole aqui o link do produto..." value="${link}">
                    <button class="btn remove-btn" onclick="removeLink(this)">×</button>
                </div>
            `;
        });
    } else {
        // Adicionar pelo menos um campo de link vazio
        cardHTML += `
            <div class="link-group">
                <input type="url" class="link-input" placeholder="Cole aqui o link do produto...">
                <button class="btn remove-btn" onclick="removeLink(this)">×</button>
            </div>
        `;
    }
    
    cardHTML += `
        </div>
        <button class="btn btn-primary add-link-btn" onclick="addLink(this)">
            ➕ Adicionar Novo Link
        </button>
    `;
    
    newCard.innerHTML = cardHTML;
    itemsGrid.appendChild(newCard);
    
    // Adicionar event listeners para os inputs
    const linkInputs = newCard.querySelectorAll('.link-input');
    linkInputs.forEach(input => {
        input.addEventListener('input', function() {
            saveData();
        });
    });
    
    // Adicionar botão de remover imagem se houver imagem
    if (cardData.image) {
        const imageContainer = newCard.querySelector('.item-image');
        const image = imageContainer.querySelector('.product-image');
        const placeholder = imageContainer.querySelector('.image-placeholder');
        
        // Definir a imagem imediatamente
        if (image) image.src = cardData.image;
        if (image) image.style.display = 'block';
        
        // Verificar se a imagem carrega corretamente
        const testImg = new Image();
        testImg.onload = function() {
            // Imagem carregou com sucesso, adicionar botão de remover
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-danger remove-image-btn';
            removeBtn.textContent = '❌ Remover Imagem';
            removeBtn.onclick = function() {
                removeImage(this);
            };
            imageContainer.appendChild(removeBtn);
            
            // Ocultar placeholder
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        };
        testImg.onerror = function() {
            // Imagem não carregou, remover src e mostrar placeholder
            if (image) image.src = '';
            if (image) image.style.display = 'none';
            if (placeholder) {
                placeholder.innerHTML = `
                    <button class="btn btn-secondary image-upload-btn" onclick="triggerImageUpload(this)">
                        📷 Adicionar Imagem
                    </button>
                    <button class="btn btn-secondary image-url-btn" onclick="showImageUrlInput(this)">
                        🔗 URL da Imagem
                    </button>
                `;
                placeholder.style.display = 'flex';
                placeholder.style.flexDirection = 'column';
                placeholder.style.alignItems = 'center';
                placeholder.style.justifyContent = 'center';
                placeholder.style.gap = '10px';
            }
        };
        testImg.src = cardData.image;
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados salvos
    loadData();
    
    // Adicionar event listeners para todos os inputs existentes após carregar
    setTimeout(() => {
        const inputs = document.querySelectorAll('.link-input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                saveData();
            });
        });
    }, 100);
});

// Carregar dados quando a página carrega
window.addEventListener('load', loadData); 