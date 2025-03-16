/**
 * Script principal para a página inicial
 */

document.addEventListener('DOMContentLoaded', () => {
    // Adicionar animação aos cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Adicionar animação aos endpoints
    const endpoints = document.querySelectorAll('.endpoint');
    endpoints.forEach((endpoint, index) => {
        endpoint.style.animationDelay = `${index * 0.05}s`;
    });

    // Verificar se o usuário está logado (tem token)
    const token = localStorage.getItem('token');
    const loginStatus = document.createElement('div');
    loginStatus.className = 'login-status';

    if (token) {
        // Se tiver token, verificar se é válido
        fetch('/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Token inválido');
            })
            .then(data => {
                console.log('Usuário autenticado:', data);
                // Aqui você pode adicionar lógica para mostrar informações do usuário logado
            })
            .catch(error => {
                console.error('Erro ao verificar token:', error);
                localStorage.removeItem('token');
            });
    }

    // Adicionar interatividade aos exemplos de código
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        // Adicionar botão de copiar
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copiar';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent)
                .then(() => {
                    copyButton.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copiar';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erro ao copiar:', err);
                });
        });

        // Adicionar o botão ao bloco de código
        const codeExample = block.closest('.code-example');
        if (codeExample) {
            const header = codeExample.querySelector('h3');
            if (header) {
                header.appendChild(copyButton);
            }
        }
    });

    // Adicionar estilos para o botão de copiar
    const style = document.createElement('style');
    style.textContent = `
    .copy-button {
      float: right;
      background-color: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .copy-button:hover {
      opacity: 0.8;
    }
    
    .login-status {
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 10px;
      border-radius: 4px;
      background-color: var(--secondary-color);
      color: white;
      font-size: 0.9rem;
      z-index: 100;
    }
  `;
    document.head.appendChild(style);
}); 