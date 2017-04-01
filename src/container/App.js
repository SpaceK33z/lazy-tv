import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import FullBackground from '../component/FullBackground';
import ActionMenu from '../component/ActionMenu';
import GameOverview from './GameOverview';
import GamePadOverview from './GamePadOverview';
import AddGame from './AddGame';

@observer
export default class App extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { store } = this.props;
        return (
            <FullBackground>
                <ActionMenu>
                    <AddGame store={store} />
                    <GamePadOverview store={store} />
                </ActionMenu>
                <GameOverview store={store} />
            </FullBackground>
        );
    }
}
