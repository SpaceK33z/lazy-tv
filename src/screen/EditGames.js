import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ActionMenu from '../component/ActionMenu';
import FlexColumn from '../component/FlexColumn';
import GameEditOverview from '../container/GameEditOverview';
import AddGameButton from '../container/AddGameButton';
import EditDoneButton from '../container/EditDoneButton';
import Center from '../component/Center';

@observer
export default class EditGamesScreen extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { store } = this.props;
        return (
            <FlexColumn>
                <ActionMenu compact>
                    <AddGameButton store={store} />
                    <EditDoneButton store={store} />
                </ActionMenu>
                <Center>
                    <GameEditOverview store={store} />
                </Center>
            </FlexColumn>
        );
    }
}
