import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './styles';
import App from './container/App';
import ViewStore from './View';
import { remote } from 'electron';

const viewStore = new ViewStore();

// In the app we subscribe to some events of the Electron window.
// When the page is refreshed (i.e. during debugging), those events are not automatically removed.
remote.getCurrentWindow().removeAllListeners();

window.addEventListener('keydown', (e) => {
    // Quit app on ctrl+Q
    if (e.ctrlKey && e.keyCode === 81) {
        remote.app.quit();
    }
});

ReactDOM.render(
    <App store={viewStore} />,
    document.getElementById('root')
);
