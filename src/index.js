import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './styles';
import App from './container/App';
import ViewStore from './View';
import { remote } from 'electron';

// In the app we subscribe to some events of the Electron window.
// When the page is refreshed (i.e. during debugging), those events are not automatically removed.
// Important: must happen BEFORE viewStore init!
remote.getCurrentWindow().removeAllListeners();

const viewStore = new ViewStore();


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
