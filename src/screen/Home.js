import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ActionMenu from '../component/ActionMenu';
import FlexColumn from '../component/FlexColumn';
import Clock from '../component/Clock';
import GameOverview from '../container/GameOverview';
import GamePadOverview from '../container/GamePadOverview';
import EditGamesButton from '../container/EditGamesButton';
import Center from '../component/Center';

@observer
export default class HomeScreen extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { store } = this.props;
        return (
            <FlexColumn>
                <ActionMenu>
                    <EditGamesButton store={store} />
                    <GamePadOverview store={store} />
                </ActionMenu>
                <Center>
                    <GameOverview store={store} />
                </Center>
                <Clock />
            </FlexColumn>
        );
    }
}
