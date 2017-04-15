import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AddGame from '../container/AddGame';
import FlexColumn from '../component/FlexColumn';
import Center from '../component/Center';

@observer
export default class AddGameScreen extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { store } = this.props;
        return (
            <FlexColumn>
                <Center horizontal vertical>
                    <AddGame store={store} />
                </Center>
            </FlexColumn>
        );
    }
}
