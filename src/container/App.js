import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import FullBackground from '../component/FullBackground';
import FlexColumn from '../component/FlexColumn';
import Home from '../screen/Home';
import AddGame from '../screen/AddGame';

@observer
export default class App extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { store } = this.props;
        const view = store.currentView;
        let content;
        switch (view) {
            case 'home':
                content = <Home store={store} />;
                break;
            case 'addGame':
                content = <AddGame store={store} />;
                break;
            default:
                throw new Error(`Unknown view: ${view}`);
        }

        return (
            <FlexColumn>
                <FullBackground />
                {content}
            </FlexColumn>
        );
    }
}
