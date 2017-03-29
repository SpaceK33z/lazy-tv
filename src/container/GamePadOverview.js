import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import GamePadList from '../component/GamePadList';
import GamePadItem from '../component/GamePadItem';

@observer
export default class GamePadOverview extends Component {
    // TODO: Don't fake this data, use the gamepad API
    render() {
        return (
            <GamePadList>
                <GamePadItem />
                <GamePadItem />
            </GamePadList>
        );
    }
}
