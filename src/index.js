import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './styles';
import App from './container/App';
import ViewStore from './View';
import { app } from './electron';

const viewStore = new ViewStore();

window.addEventListener('keydown', (e) => {
    // Quit app on ctrl+Q
    if (e.ctrlKey && e.keyCode === 81) {
        app.quit();
    }
});

ReactDOM.render(
    <App store={viewStore} />,
    document.getElementById('root')
);
