import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import GamePadList from '../component/GamePadList';
import GamePadItem from '../component/GamePadItem';

@observer
export default class GamePadOverview extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    renderItem = (gamepad) => {
        return <GamePadItem key={gamepad.index} />;
    };

    render() {
        return (
            <GamePadList>
                {this.props.store.gamepads.map(this.renderItem)}
            </GamePadList>
        );
    }
}
