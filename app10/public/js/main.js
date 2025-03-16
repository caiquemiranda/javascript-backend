/**
 * Script principal para a interface de upload de arquivos
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos da interface
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const notification = document.getElementById('notification');

    // Formulários
    const singleImageForm = document.getElementById('single-image-form');
    const multipleImagesForm = document.getElementById('multiple-images-form');
    const documentForm = document.getElementById('document-form');

    // Inputs de arquivo
    const singleImageInput = document.getElementById('single-image-input');
    const multipleImagesInput = document.getElementById('multiple-images-input');
    const documentInput = document.getElementById('document-input');

    // Elementos de prévia
    const singleImagePreview = document.getElementById('single-image-preview');
    const multipleImagesPreview = document.getElementById('multiple-images-preview');
    const documentPreview = document.getElementById('document-preview');

    // Elementos de nome de arquivo
    const singleImageName = document.getElementById('single-image-name');
    const multipleImagesName = document.getElementById('multiple-images-name');
    const documentName = document.getElementById('document-name');

    // Containers de arquivos
    const imagesContainer = document.getElementById('images-container');
    const documentsContainer = document.getElementById('documents-container');

    // Navegação por abas
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe ativa de todos os botões e painéis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Adicionar classe ativa ao botão clicado
            button.classList.add('active');

            // Mostrar o painel correspondente
            const target = button.dataset.target;
            document.getElementById(target).classList.add('active');

            // Carregar arquivos se estiver na aba de lista
            if (target === 'file-list') {
                loadImages();
                loadDocuments();
            }
        });
    });

    // Prévia de imagem única
    singleImageInput.addEventListener('change', () => {
        const file = singleImageInput.files[0];

        if (file) {
            singleImageName.textContent = file.name;

            // Limpar prévia anterior
            singleImagePreview.innerHTML = '';

            // Criar elemento de imagem
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src);

            // Adicionar imagem à prévia
            singleImagePreview.appendChild(img);
        } else {
            singleImageName.textContent = 'Nenhum arquivo selecionado';
            singleImagePreview.innerHTML = `
        <div class="placeholder">
          <i class="fas fa-image"></i>
          <p>Prévia da imagem</p>
        </div>
      `;
        }
    });

    // Prévia de múltiplas imagens
    multipleImagesInput.addEventListener('change', () => {
        const files = multipleImagesInput.files;

        if (files.length > 0) {
            multipleImagesName.textContent = `${files.length} arquivo(s) selecionado(s)`;

            // Limpar prévia anterior
            multipleImagesPreview.innerHTML = '';

            // Criar elementos de prévia para cada imagem
            Array.from(files).forEach(file => {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';

                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.onload = () => URL.revokeObjectURL(img.src);

                previewItem.appendChild(img);
                multipleImagesPreview.appendChild(previewItem);
            });
        } else {
            multipleImagesName.textContent = 'Nenhum arquivo selecionado';
            multipleImagesPreview.innerHTML = `
        <div class="placeholder">
          <i class="fas fa-images"></i>
          <p>Prévia das imagens</p>
        </div>
      `;
        }
    });

    // Prévia de documento
    documentInput.addEventListener('change', () => {
        const file = documentInput.files[0];

        if (file) {
            documentName.textContent = file.name;

            // Limpar prévia anterior
            documentPreview.innerHTML = '';

            // Determinar o ícone com base no tipo de arquivo
            let icon = 'file-alt';
            if (file.name.endsWith('.pdf')) {
                icon = 'file-pdf';
            } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                icon = 'file-word';
            }

            // Criar elemento de prévia
            documentPreview.innerHTML = `
        <div class="placeholder">
          <i class="fas fa-${icon}" style="font-size: 3rem; color: var(--primary-color);"></i>
          <p>${file.name}</p>
          <p>${formatFileSize(file.size)}</p>
        </div>
      `;
        } else {
            documentName.textContent = 'Nenhum arquivo selecionado';
            documentPreview.innerHTML = `
        <div class="placeholder">
          <i class="fas fa-file-alt"></i>
          <p>Prévia do documento</p>
        </div>
      `;
        }
    });

    // Upload de imagem única
    singleImageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = singleImageInput.files[0];

        if (!file) {
            showNotification('Por favor, selecione uma imagem para enviar.', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/files/images/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Imagem enviada com sucesso!', 'success');
                singleImageForm.reset();
                singleImagePreview.innerHTML = `
          <div class="placeholder">
            <i class="fas fa-image"></i>
            <p>Prévia da imagem</p>
          </div>
        `;
                singleImageName.textContent = 'Nenhum arquivo selecionado';
            } else {
                showNotification(data.message || 'Erro ao enviar imagem.', 'error');
            }
        } catch (error) {
            showNotification('Erro ao enviar imagem. Tente novamente.', 'error');
            console.error('Erro:', error);
        }
    });

    // Upload de múltiplas imagens
    multipleImagesForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const files = multipleImagesInput.files;

        if (files.length === 0) {
            showNotification('Por favor, selecione pelo menos uma imagem para enviar.', 'error');
            return;
        }

        try {
            const formData = new FormData();

            Array.from(files).forEach(file => {
                formData.append('images', file);
            });

            const response = await fetch('/api/files/images/multiple', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(`${files.length} imagem(ns) enviada(s) com sucesso!`, 'success');
                multipleImagesForm.reset();
                multipleImagesPreview.innerHTML = `
          <div class="placeholder">
            <i class="fas fa-images"></i>
            <p>Prévia das imagens</p>
          </div>
        `;
                multipleImagesName.textContent = 'Nenhum arquivo selecionado';
            } else {
                showNotification(data.message || 'Erro ao enviar imagens.', 'error');
            }
        } catch (error) {
            showNotification('Erro ao enviar imagens. Tente novamente.', 'error');
            console.error('Erro:', error);
        }
    });

    // Upload de documento
    documentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = documentInput.files[0];

        if (!file) {
            showNotification('Por favor, selecione um documento para enviar.', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('document', file);

            const response = await fetch('/api/files/documents/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Documento enviado com sucesso!', 'success');
                documentForm.reset();
                documentPreview.innerHTML = `
          <div class="placeholder">
            <i class="fas fa-file-alt"></i>
            <p>Prévia do documento</p>
          </div>
        `;
                documentName.textContent = 'Nenhum arquivo selecionado';
            } else {
                showNotification(data.message || 'Erro ao enviar documento.', 'error');
            }
        } catch (error) {
            showNotification('Erro ao enviar documento. Tente novamente.', 'error');
            console.error('Erro:', error);
        }
    });

    // Carregar imagens
    async function loadImages() {
        try {
            imagesContainer.innerHTML = `
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Carregando imagens...</p>
        </div>
      `;

            const response = await fetch('/api/files/images');
            const data = await response.json();

            if (response.ok) {
                if (data.images.length === 0) {
                    imagesContainer.innerHTML = `
            <div class="empty-message">
              <p>Nenhuma imagem encontrada.</p>
            </div>
          `;
                    return;
                }

                imagesContainer.innerHTML = '';

                data.images.forEach(image => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.innerHTML = `
            <img src="${image.url}" alt="${image.name}" class="file-image">
            <div class="file-info">
              <div class="file-name">${image.name.substring(0, 15)}${image.name.length > 15 ? '...' : ''}</div>
              <div class="file-meta">
                <span>${image.readableSize}</span>
                <span>${formatDate(new Date(image.uploaded))}</span>
              </div>
            </div>
            <div class="file-actions">
              <button class="file-action-btn view" title="Visualizar" onclick="window.open('${image.url}', '_blank')">
                <i class="fas fa-eye"></i>
              </button>
              <button class="file-action-btn delete" title="Excluir" data-filename="${image.name}" onclick="deleteImage('${image.name}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

                    imagesContainer.appendChild(fileItem);
                });
            } else {
                imagesContainer.innerHTML = `
          <div class="error-message">
            <p>Erro ao carregar imagens: ${data.message}</p>
          </div>
        `;
            }
        } catch (error) {
            imagesContainer.innerHTML = `
        <div class="error-message">
          <p>Erro ao carregar imagens. Tente novamente.</p>
        </div>
      `;
            console.error('Erro:', error);
        }
    }

    // Carregar documentos
    async function loadDocuments() {
        try {
            documentsContainer.innerHTML = `
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Carregando documentos...</p>
        </div>
      `;

            const response = await fetch('/api/files/documents');
            const data = await response.json();

            if (response.ok) {
                if (data.documents.length === 0) {
                    documentsContainer.innerHTML = `
            <div class="empty-message">
              <p>Nenhum documento encontrado.</p>
            </div>
          `;
                    return;
                }

                documentsContainer.innerHTML = '';

                data.documents.forEach(doc => {
                    // Determinar o ícone com base no tipo de arquivo
                    let icon = 'file-alt';
                    if (doc.type === 'pdf') {
                        icon = 'file-pdf';
                    } else if (doc.type === 'doc' || doc.type === 'docx') {
                        icon = 'file-word';
                    }

                    const documentItem = document.createElement('div');
                    documentItem.className = 'document-item';
                    documentItem.innerHTML = `
            <div class="document-icon">
              <i class="fas fa-${icon}"></i>
            </div>
            <div class="document-info">
              <div class="document-name">${doc.name}</div>
              <div class="document-meta">
                ${doc.readableSize} • ${formatDate(new Date(doc.uploaded))}
              </div>
            </div>
            <div class="document-actions">
              <button class="btn btn-primary" onclick="window.open('${doc.url}', '_blank')">
                <i class="fas fa-download"></i>
              </button>
              <button class="btn btn-danger" onclick="deleteDocument('${doc.name}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

                    documentsContainer.appendChild(documentItem);
                });
            } else {
                documentsContainer.innerHTML = `
          <div class="error-message">
            <p>Erro ao carregar documentos: ${data.message}</p>
          </div>
        `;
            }
        } catch (error) {
            documentsContainer.innerHTML = `
        <div class="error-message">
          <p>Erro ao carregar documentos. Tente novamente.</p>
        </div>
      `;
            console.error('Erro:', error);
        }
    }

    // Função para mostrar notificações
    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Função para formatar o tamanho do arquivo
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }
    }

    // Função para formatar data
    function formatDate(date) {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    }

    // Expor funções para uso global
    window.deleteImage = async function (filename) {
        if (!confirm('Tem certeza que deseja excluir esta imagem?')) {
            return;
        }

        try {
            const response = await fetch(`/api/files/images/${filename}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Imagem excluída com sucesso!', 'success');
                loadImages();
            } else {
                showNotification(data.message || 'Erro ao excluir imagem.', 'error');
            }
        } catch (error) {
            showNotification('Erro ao excluir imagem. Tente novamente.', 'error');
            console.error('Erro:', error);
        }
    };

    window.deleteDocument = async function (filename) {
        if (!confirm('Tem certeza que deseja excluir este documento?')) {
            return;
        }

        try {
            const response = await fetch(`/api/files/documents/${filename}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Documento excluído com sucesso!', 'success');
                loadDocuments();
            } else {
                showNotification(data.message || 'Erro ao excluir documento.', 'error');
            }
        } catch (error) {
            showNotification('Erro ao excluir documento. Tente novamente.', 'error');
            console.error('Erro:', error);
        }
    };
}); 