import { store } from './store.js';

const elements = {
    shapeList: document.getElementById('shape-list'),
    addSquareBtn: document.getElementById('add-square'),
    addCircleBtn: document.getElementById('add-circle'),
    recolorSquaresBtn: document.getElementById('recolor-squares'),
    recolorCirclesBtn: document.getElementById('recolor-circles'),
    squareCount: document.getElementById('count-squares'),
    circleCount: document.getElementById('count-circles')
};

const createShapeElement = ({ id, type, color }) => {
    const div = document.createElement('div');
    div.classList.add('shape', type);
    div.style.backgroundColor = color;
    div.dataset.id = id;
    return div;
};

const updateCounters = () => {
    elements.squareCount.textContent = store.squareCount;
    elements.circleCount.textContent = store.circleCount;
};

const handleStateChange = (action) => {
    updateCounters();

    if (!action) return;

    switch (action.type) {
        case 'ADD':
            elements.shapeList.appendChild(createShapeElement(action.payload));
            break;
        case 'REMOVE':
            const elementToRemove = elements.shapeList.querySelector(`[data-id="${action.payload}"]`);
            if (elementToRemove) elementToRemove.remove();
            break;
        case 'UPDATE_COLOR':
            const shapes = store.getAllShapes();
            shapes.forEach(shape => {
                if (shape.type === action.payload) {
                    const el = elements.shapeList.querySelector(`[data-id="${shape.id}"]`);
                    if (el) el.style.backgroundColor = shape.color;
                }
            });
            break;
    }
};

export const initUI = () => {
    store.subscribe(handleStateChange);

    const initialShapes = store.getAllShapes();
    initialShapes.forEach(shape => {
        elements.shapeList.appendChild(createShapeElement(shape));
    });
    updateCounters();

    elements.addSquareBtn.addEventListener('click', () => store.addShape('square'));
    elements.addCircleBtn.addEventListener('click', () => store.addShape('circle'));
    elements.recolorSquaresBtn.addEventListener('click', () => store.recolorShapes('square'));
    elements.recolorCirclesBtn.addEventListener('click', () => store.recolorShapes('circle'));

    elements.shapeList.addEventListener('click', (e) => {
        if (e.target.classList.contains('shape')) {
            store.removeShape(e.target.dataset.id);
        }
    });
};