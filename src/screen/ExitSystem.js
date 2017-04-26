import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import FlexColumn from '../component/FlexColumn';
import Center from '../component/Center';
import ExitSystem from '../container/ExitSystem';

@observer
export default class ExitSystemScreen extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { store } = this.props;
        return (
            <FlexColumn>
                <Center horizontal vertical>
                    <ExitSystem store={store} />
                </Center>
            </FlexColumn>
        );
    }
}
