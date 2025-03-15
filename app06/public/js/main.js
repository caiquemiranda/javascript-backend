/**
 * Script principal para a página inicial
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('App 6 - Introdução ao Express.js carregado!');

    // Adiciona efeito de hover nos cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            card.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
    });

    // Adiciona funcionalidade para verificar status da API
    const checkApiStatus = async () => {
        try {
            const response = await fetch('/api');
            const data = await response.json();

            if (response.ok) {
                console.log('API está online:', data);
                showApiStatus(true);
            } else {
                console.error('API retornou erro:', data);
                showApiStatus(false);
            }
        } catch (error) {
            console.error('Erro ao verificar status da API:', error);
            showApiStatus(false);
        }
    };

    // Exibe o status da API na página
    const showApiStatus = (isOnline) => {
        const header = document.querySelector('header');

        // Remove status anterior se existir
        const oldStatus = document.querySelector('.api-status');
        if (oldStatus) {
            oldStatus.remove();
        }

        // Cria elemento de status
        const statusElement = document.createElement('div');
        statusElement.className = 'api-status';
        statusElement.style.padding = '5px 10px';
        statusElement.style.borderRadius = '4px';
        statusElement.style.marginTop = '10px';
        statusElement.style.display = 'inline-block';

        if (isOnline) {
            statusElement.textContent = 'API Online';
            statusElement.style.backgroundColor = '#2ecc71';
            statusElement.style.color = 'white';
        } else {
            statusElement.textContent = 'API Offline';
            statusElement.style.backgroundColor = '#e74c3c';
            statusElement.style.color = 'white';
        }

        header.appendChild(statusElement);
    };

    // Verifica o status da API ao carregar a página
    checkApiStatus();
}); 