document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'kanban_data';
    const columns = ['todo', 'inprogress', 'done'];
    let cardsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const saveState = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsData));
        updateCounters();
    };

    const getRandomColor = () => {
        const h = Math.floor(Math.random() * 360);
        return `hsl(${h}, 70%, 90%)`;
    };

    const generateId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const createCardElement = (card) => {
        const el = document.createElement('div');
        el.className = 'kanban-card';
        el.setAttribute('data-id', card.id);
        el.style.backgroundColor = card.color;

        el.innerHTML = `
            <button class="btn-delete" title="Usuń">✕</button>
            <div class="card-content" contenteditable="true">${card.content}</div>
            <div class="card-actions">
                <button class="action-btn move-left" title="Przesuń w lewo">←</button>
                <button class="action-btn btn-card-color" title="Zmień kolor">🎨</button>
                <button class="action-btn move-right" title="Przesuń w prawo">→</button>
            </div>
        `;
        return el;
    };

    const renderBoard = () => {
        columns.forEach(colId => {
            const list = document.querySelector(`#col-${colId} .card-list`);
            list.innerHTML = '';
        });

        cardsData.forEach(card => {
            const list = document.querySelector(`#col-${card.columnId} .card-list`);
            if (list) {
                list.appendChild(createCardElement(card));
            }
        });

        updateCounters();
    };

    const updateCounters = () => {
        columns.forEach(colId => {
            const count = cardsData.filter(c => c.columnId === colId).length;
            document.querySelector(`#col-${colId} .counter`).textContent = count;
        });
    };

 
    const board = document.querySelector('.board');

    board.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('btn-add')) {
            const columnEl = target.closest('.column');
            const columnId = columnEl.dataset.id;
            
            const newCard = {
                id: generateId(),
                content: 'Nowe zadanie',
                color: getRandomColor(),
                columnId: columnId
            };
            
            cardsData.push(newCard);
            saveState();
            
            const list = columnEl.querySelector('.card-list');
            list.appendChild(createCardElement(newCard));
            updateCounters();
        }

        if (target.classList.contains('btn-color')) {
            const columnEl = target.closest('.column');
            const columnId = columnEl.dataset.id;
            const newColor = getRandomColor();
            cardsData.forEach(card => {
                if (card.columnId === columnId) {
                    card.color = newColor;
                }
            });
            saveState();
            renderBoard();
        }

        if (target.classList.contains('btn-sort')) {
            const columnEl = target.closest('.column');
            const columnId = columnEl.dataset.id;
            const colCards = cardsData.filter(c => c.columnId === columnId);
            const otherCards = cardsData.filter(c => c.columnId !== columnId);

            colCards.sort((a, b) => a.content.localeCompare(b.content));
            cardsData = [...otherCards, ...colCards];
            
            const others = cardsData.filter(c => c.columnId !== columnId);
            const current = cardsData.filter(c => c.columnId === columnId).sort((a, b) => a.content.localeCompare(b.content));
            cardsData = [...others, ...current];
            
            saveState();
            renderBoard();
        }

        const cardEl = target.closest('.kanban-card');
        if (!cardEl) return;

        const cardId = cardEl.dataset.id;
        const cardIndex = cardsData.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return;

        if (target.classList.contains('btn-delete')) {
            cardsData.splice(cardIndex, 1);
            saveState();
            cardEl.remove();
            updateCounters();
        }

        if (target.classList.contains('move-left') || target.classList.contains('move-right')) {
            const currentColumnId = cardsData[cardIndex].columnId;
            const currentColIndex = columns.indexOf(currentColumnId);
            
            let newColIndex;
            if (target.classList.contains('move-left')) {
                newColIndex = currentColIndex - 1;
            } else {
                newColIndex = currentColIndex + 1;
            }

            if (newColIndex >= 0 && newColIndex < columns.length) {
                cardsData[cardIndex].columnId = columns[newColIndex];
                saveState();
                renderBoard();
            }
        }

        if (target.classList.contains('btn-card-color')) {
            const newColor = getRandomColor();
            cardsData[cardIndex].color = newColor;
            saveState();
            cardEl.style.backgroundColor = newColor;
        }
    });

    board.addEventListener('focusout', (e) => {
        if (e.target.classList.contains('card-content')) {
            const cardEl = e.target.closest('.kanban-card');
            const cardId = cardEl.dataset.id;
            const newContent = e.target.innerText;

            const card = cardsData.find(c => c.id === cardId);
            if (card) {
                card.content = newContent;
                saveState();
            }
        }
    });
    renderBoard();
});