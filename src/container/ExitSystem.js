import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Button from '../component/Button';
import FlexColumn from '../component/FlexColumn';
import ContainerMedium from '../component/ContainerMedium';

@observer
export default class ExitSystem extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    handleShutdown = () => {
        this.props.store.currentView = { screen: 'exitSystemConfirm', type: 'shutdown' };
    };

    handleRestart = () => {
        this.props.store.currentView = { screen: 'exitSystemConfirm', type: 'restart' };
    };

    handleSleep = () => {
        this.props.store.currentView = { screen: 'exitSystemConfirm', type: 'sleep' };
    };

    goBack = () => {
        this.props.store.currentView = { screen: 'home' };
    };

    render() {
        return (
            <ContainerMedium>
                <FlexColumn>
                    <Button onClick={this.handleShutdown}>Shutdown</Button>
                    <Button onClick={this.handleRestart}>Restart</Button>
                    <Button onClick={this.handleSleep}>Sleep</Button>
                    <Button onClick={this.goBack}>Go back</Button>
                </FlexColumn>
            </ContainerMedium>
        );
    }
}
