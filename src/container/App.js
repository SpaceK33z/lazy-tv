import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import FullBackground from '../component/FullBackground';
import GameOverview from './GameOverview';
import GamePadOverview from './GamePadOverview';

@observer
export default class App extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        return (
            <FullBackground>
                <GamePadOverview />
                <GameOverview store={this.props.store} />
            </FullBackground>
        );
    }
}
