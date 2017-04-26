import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import FlexColumn from '../component/FlexColumn';
import Center from '../component/Center';
import ExitSystemConfirm from 'container/ExitSystemConfirm';

@observer
export default class ExitSystemConfirmScreen extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { store } = this.props;
        return (
            <FlexColumn>
                <Center horizontal vertical>
                    <ExitSystemConfirm store={store} />
                </Center>
            </FlexColumn>
        );
    }
}
