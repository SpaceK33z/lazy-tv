import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './styles';
import App from './container/App';
import ViewStore from './View';

const viewStore = new ViewStore();

ReactDOM.render(
    <App store={viewStore} />,
    document.getElementById('root')
);
