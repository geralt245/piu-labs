import { getRandomColor, generateId } from './helpers.js';

class Store {
    constructor() {
        this.shapes = JSON.parse(localStorage.getItem('shapes')) || [];
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    notify(action) {
        localStorage.setItem('shapes', JSON.stringify(this.shapes));
        this.observers.forEach(observer => observer(action));
    }

    get squareCount() {
        return this.shapes.filter(shape => shape.type === 'square').length;
    }

    get circleCount() {
        return this.shapes.filter(shape => shape.type === 'circle').length;
    }

    getShape(id) {
        return this.shapes.find(shape => shape.id === id);
    }

    getAllShapes() {
        return this.shapes;
    }

    addShape(type) {
        const shape = {
            id: generateId(),
            type: type,
            color: getRandomColor()
        };
        this.shapes.push(shape);
        this.notify({ type: 'ADD', payload: shape });
    }

    removeShape(id) {
        this.shapes = this.shapes.filter(shape => shape.id !== id);
        this.notify({ type: 'REMOVE', payload: id });
    }

    recolorShapes(type) {
        this.shapes = this.shapes.map(shape => {
            if (shape.type === type) {
                return { ...shape, color: getRandomColor() };
            }
            return shape;
        });
        this.notify({ type: 'UPDATE_COLOR', payload: type });
    }
}

export const store = new Store();