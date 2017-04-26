import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import FullBackground from '../component/FullBackground';
import NotificationArea from '../component/NotificationArea';
import FlexColumn from '../component/FlexColumn';
import Home from '../screen/Home';
import AddGame from '../screen/AddGame';
import EditGames from '../screen/EditGames';
import ExitSystem from '../screen/ExitSystem';

@observer
export default class App extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { store } = this.props;
        const view = store.currentView;
        let content;
        switch (view.screen) {
            case 'home':
                content = <Home store={store} />;
                break;
            case 'editGames':
                content = <EditGames store={store} />;
                break;
            case 'addGame':
                content = <AddGame store={store} />;
                break;
            case 'exitSystem':
                content = <ExitSystem store={store} />;
                break;
            default:
                throw new Error(`Unknown view: ${view.screen}`);
        }

        return (
            <FlexColumn>
                <FullBackground />
                {content}
                <NotificationArea store={store} />
            </FlexColumn>
        );
    }
}
