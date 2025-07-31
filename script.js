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
    const itemsGrid = document.querySelector('.items-grid');
    
    const newCard = document.createElement('div');
    newCard.className = 'item-card';
    newCard.innerHTML = `
        <button class="delete-card-btn" onclick="deleteCard(this)" title="Excluir item">×</button>
        <h2 class="item-title">${itemName}</h2>
        <div class="item-image">
            <img src="" alt="Imagem do produto" class="product-image" style="display: none;">
            <div class="image-placeholder">
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
            <div class="link-group">
                <input type="url" class="link-input" placeholder="Cole aqui o link do produto...">
                <button class="btn remove-btn" onclick="removeLink(this)">×</button>
            </div>
        </div>
        <button class="btn btn-primary add-link-btn" onclick="addLink(this)">
            ➕ Adicionar Novo Link
        </button>
    `;
    
    // Adicionar efeito de fade in
    newCard.style.opacity = '0';
    newCard.style.transform = 'scale(0.8)';
    itemsGrid.appendChild(newCard);
    
    // Animar a entrada do card
    setTimeout(() => {
        newCard.style.transition = 'all 0.3s ease';
        newCard.style.opacity = '1';
        newCard.style.transform = 'scale(1)';
    }, 10);
    
    // Adicionar event listener para o novo input
    const newInput = newCard.querySelector('.link-input');
    newInput.addEventListener('input', function() {
        saveData();
    });
    
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
            
            image.src = e.target.result;
            image.style.display = 'block';
            placeholder.style.display = 'none';
            uploadBtn.style.display = 'none';
            urlBtn.style.display = 'none';
            
            // Adicionar botão de remover imagem
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-danger remove-image-btn';
            removeBtn.textContent = '❌ Remover Imagem';
            removeBtn.onclick = function() {
                removeImage(this);
            };
            imageContainer.appendChild(removeBtn);
            
            // Salvar dados
            saveData();
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
        loadImageFromUrl(urlInput.value, imageContainer);
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
        const image = imageContainer.querySelector('.product-image');
        const placeholder = imageContainer.querySelector('.image-placeholder');
        const uploadBtn = imageContainer.querySelector('.image-upload-btn');
        const urlBtn = imageContainer.querySelector('.image-url-btn');
        
        // Testar se a imagem carrega
        const testImg = new Image();
        testImg.onload = function() {
            image.src = url;
            image.style.display = 'block';
            placeholder.style.display = 'none';
            uploadBtn.style.display = 'none';
            urlBtn.style.display = 'none';
            
            // Adicionar botão de remover imagem
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-danger remove-image-btn';
            removeBtn.textContent = '❌ Remover Imagem';
            removeBtn.onclick = function() {
                removeImage(this);
            };
            imageContainer.appendChild(removeBtn);
            
            // Salvar dados
            saveData();
        };
        testImg.onerror = function() {
            alert('Erro ao carregar a imagem. Verifique se a URL está correta.');
                    // Restaurar placeholder
        placeholder.innerHTML = '';
        placeholder.style.display = 'flex';
        placeholder.style.flexDirection = 'column';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.gap = '10px';
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
    
    image.src = '';
    image.style.display = 'none';
    
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
    saveData();
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
    const inputs = document.querySelectorAll('.link-input');
    const data = {};
    
    inputs.forEach((input, index) => {
        if (input.value.trim()) {
            data[`link_${index}`] = input.value;
        }
    });
    
    localStorage.setItem('shoppingList', JSON.stringify(data));
}

// Função para carregar dados do localStorage
function loadData() {
    const savedData = localStorage.getItem('shoppingList');
    if (savedData) {
        const data = JSON.parse(savedData);
        const inputs = document.querySelectorAll('.link-input');
        
        Object.values(data).forEach((value, index) => {
            if (inputs[index]) {
                inputs[index].value = value;
            }
        });
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar event listeners para todos os inputs existentes
    const inputs = document.querySelectorAll('.link-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            saveData();
        });
    });
    
    // Carregar dados salvos
    loadData();
});

// Carregar dados quando a página carrega
window.addEventListener('load', loadData); 